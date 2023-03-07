<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Balping\HashSlug\HasHashSlug;
use Fico7489\Laravel\Pivot\Traits\PivotEventTrait;
use Illuminate\Database\Eloquent\SoftDeletes;

use Carbon\Carbon;
use Twilio\Rest\Client;

class Shindig extends Model
{
    use SoftDeletes;
    use PivotEventTrait;

    protected $guarded = [];
    protected $dates = ['event_date'];

    use HasHashSlug;
    protected static $minSlugLength = 5;

    public function phoneNumbers()
    {
        return $this->hasMany(PhoneNumber::class);
    }

    public function groups()
    {
        return $this->hasMany(Group::class);
    }

    public function getAllGuestGroup()
    {
        // give me the group id to use to send a message to all shindig guests
        return $this->groups()->where('is_all', true)->first();
    }
    public function getTestGroup()
    {
        return $this->groups()->where('is_testGroup', true)->first();
    }

    public function guests()
    {
        return $this->hasMany(Guest::class);
    }

    public function guestCount()
    {
        return $this->guests()->count();
    }

    public function getGuest($test_phone)
    {
        // determine if a phone number is a guest at this event
        // if yes, returns the Guest
        // if not, return false
        return $this->guests()->where('guest_phone', $test_phone)->first();
    }

    public function getChatGuest($guestId)
    {
      
        return $this->guests()->where('id', $guestId)->first();
    }

    public function owners()
    {
        return $this->belongsToMany(User::class, 'shindig_ownership')->using(ShindigOwnership::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function media()
    {
        return $this->hasMany(Media::class, 'shindig_id');
    }

    public function messageCount()
    {
        return $this->messages()->count();
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function invitations()
    {
        return $this->hasMany(Invitation::class, 'shindig_id');
    }

    public function activities()
    {
        return $this->hasMany(Activity::class, 'messagingServiceSid', 'messagingServiceSid');
    }

    public function inboundSMS()
    {
        return $this->hasMany(InboundSMS::class, 'shindig_id');
    }
    public function promoDetails()
    {
        return $this->hasMany(PromoDetail::class);
    }

    public function activate()
    {
        // $sid = env('TWILIO_LIVE_SID', null);
        // $token = env('TWILIO_LIVE_TOKEN', null);
        // if ($sid == null || $token == null) {
        //     return false; // env not properly configured
        // }

        // $twilio = new Client($sid, $token);

        // $service = $twilio->messaging->v1->services->create("TMG - Shindig " . $this->id);

        // $this->messagingServiceSid = $service->sid;
        $this->is_activated = true;
        $this->text_to_join = true;
        $this->save();
        $number = $this->provisionNewPhoneNumber(); //provision the number .
        // dd($number);
        // dd(print_r($number));
        // configure the Messaging Service
        // $result = $twilio->messaging->v1->services($service->sid)->update(array(
        //     "friendlyName" => "TMG - Shindig " . $this->id,
        //     "validityPeriod" => "1800", // 30 minutes,
        //     "inboundRequestUrl" => env('APP_URL', 'https://textmyguests.com') . "/handleInboundSMS",
        //     "statusCallback" => env('APP_URL', 'https://textmyguests.com') . "/handleSMSCallback",
        //     //"inboundRequestUrl" => str_replace('http://', 'https://', route('handleSMS')),
        //     //"inboundRequestUrl" => str_replace('http://', 'https://', route('SMScallback')),
        // ));

        // Send an SMS to all owners to tell them their event is now active.
        foreach ($this->owners as $owner) {
            if (isset($owner->mobilePhone)) {
                @\App\sendSMS2(
                    $owner->mobilePhone,
                    "Thanks for signing up for TextMyGuests! We will use this number to send messages to your guests, and any replies here will be added to your reply stream.",
                    null,
                    $this->messagingServiceSid,
                    NULL,
                    $number
                );
            }
        }

        // return $result;
    }

    public function provisionNewPhoneNumber()
    {
        // buy a phone number from Twilio - this can be called multiple times to add more load balancing numbers to the shindig
        // Observer automatically attempts geolocation for Shindig's location and adds number to the correct MessagingService
        $number = new PhoneNumber;
        $number->shindig_id = $this->id;
        $number->save();
        $number->provision();
        return $number->number;
    }

    public function paidGuestLimit()
    {
        // how many Guests have been paid for for this event?
        // add up the number of credits they've purchased from their invoices and return that

        $paid_invoices = $this->invoices->filter(function ($invoice) {
            return $invoice->total_price >= $invoice->paid_amount;
        });

        if ($paid_invoices)
            return $paid_invoices->sum('total_credits');
        else
            return 0;
    }

    public function discount()
    {
        $discount = 0;
        $discount_owner = ''; // Full name of owner providing the discount
        $owners = $this->owners;

        foreach ($owners as $owner) {
            if ($owner->partner_discount && $owner->partner_discount > $discount) {
                $discount = $owner->partner_discount;
                $discount_owner = $owner->first_name . ' ' . $owner->last_name;
            }
        }

        return (object) [
            'percentage' => $discount,
            'owner' => $discount_owner
        ];
    }

    public function makeFree()
    {
        // create dummy invoices to make this Shindig free up to 10,000 guests
        $i = new Invoice;
        $i->user_id = 0;
        $i->shindig_id = $this->id;
        $i->paid_amount = 0;
        $i->paid_at = Carbon::now();
        $i->save();

        $l = new InvoiceLineItem;
        $l->name = "Comp - 10,000 Guests Credit";
        $l->each_price = 0;
        $l->quantity = 1;
        $l->line_credits = 10000;

        $i->addLineItem($l);

        return $i;
    }

    public function addPromotionalMessage()
    {
        $message = new Message;
        $message->shindig_id = $this->id;
        $message->contents =
            "Thanks for attending our event! Did you love these text messages? We used an app called TextMyGuests, you can check it out at http://textmyguests.com";
        $message->ready_to_send = true;
        $message->promotion = 'share50';

        // Set the promotional message to send at 11:00 am in the user timezone
        // the day after the event or the day after the last message
        // if the last message is later than the event_date
        $last_message = $this->messages()->whereDate('send_at', '>', $this->event_date)->latest('send_at')->first();
        if (!$last_message) {
            $tzOffset = $this->event_date->setTimezone($this->timezone)->getOffset() / 3600; // Timezone offset in hours
            $send_at = $this->event_date
                ->addDay()
                ->startOfDay()
                ->addHours(11 - $tzOffset);
        } else {
            $send_at = $last_message->send_at
                ->setTimezone($this->timezone)
                ->addDay()
                ->startOfDay()
                ->addHours(11)
                ->setTimezone('UTC');
        }
        $message->send_at = $send_at;

        $message->save();
        $all_guests_group_id = $this->getAllGuestGroup()->id;
        $message->recipients()->sync([$all_guests_group_id]);
    }

    public function promotions()
    {
        $messages = $this->messages()->whereNotNull('promotion')->get();

        $promotions = [];
        foreach ($messages as $message) {
            $promotions[] = $message->promotion;
        }

        return $promotions;
    }
    public function activatePaymentStatus()
    {
        //if event has not been provisioned any number then provision a num to that event
        $phone_number = PhoneNumber::where('shindig_id', $this->id)->get();
        if (isset($phone_number) && $phone_number->isEmpty()) {
            $this->activate();
        }
        $this->payment_status = true;
        $this->save();
    }

    public function primary_owner()
    {
        return $this->belongsTo(User::class, 'primary_owner');
    }

    public function chats()
    {
        return $this->hasMany(Chat::class);
    }
}
