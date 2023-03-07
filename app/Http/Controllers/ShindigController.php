<?php

namespace App\Http\Controllers;

use App\Events\ChangeActivationStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Notifications\Notifications;
use App\Http\Requests\SaveShindigRequest;
use App\Http\Requests\ActivateShindigRequest;
use App\Http\Requests\UpgradeShindigRequest;
use App\Http\Requests\PromotionRequest;
use App\Invoice;
use App\InvoiceLineItem;
use App\PhoneNumber;
use App\Promocode;
use App\PromoDetail;
use App\Shindig;
use App\User;
use Exception;
use Illuminate\Support\Facades\Log;
use Newsletter;
use App\Notifications\PushNotification;
use OneSignal;
use App\UserTokens;

class ShindigController extends Controller
{
    /**
     *  Available plans to activate/upgrade an event.
     * ** Not used anymore, but kept in case we come
     *    back to a similar pricing model.
     */
    public $plans = [
        "tier1" => [
            "credits" => 100,
            "price" => 149
        ],
        "tier2" => [
            "credits" => 200,
            "price" => 249
        ],
        "tier3" => [
            "credits" => 350,
            "price" => 349
        ]
    ];

    /**
     *  Flat rate per guest if you have more guests
     *  than the highest available plan.
     * ** Not used anymore, but kept in case we come
     *    back to a similar pricing model.
     */
    public $flat_rate = 1; // 1$ per guest if you have over 350 guests.

    public function __construct()
    {
        $this->middleware('can:modify,event')
            ->except('index', 'store', 'publicReplyStream', 'showPublic');
    }

    public function index(Request $request)
    {
        // Get the current user
        $user = auth()->user();

        // Get his events sorted by their event_date
        $shindigs = $user->shindigs->sortBy('event_date');
        if ($request->has('active') && $request->get('active')) { // If not all events are requested
            // filter out all finished events
            $now = Carbon::now();
            $shindigs = $shindigs->filter(function ($shindig) use ($now) {
                return $shindig->event_date->addDays(30) <= $now;
            });
        }
        // transforming the data for consuming
        $shindigs = $shindigs->map(function ($shindig) {
            return $this->transform($shindig);
        })->values();
        // TODO handle error
        $data = [
            'status' => 'success',
            'data' => $shindigs
        ];
        return response()->json($data);
    }

    public function show(Shindig $shindig)
    {
        $data = [
            'status' => 'success',
            'data' => $this->transform($shindig)
        ];
        return response()->json($data);
    }

    /**
     * Returns public information about the event.
     * Event name and date.
     */
    public function showPublic(Shindig $shindig)
    {
        $data = [
            'status' => 'success',
            'data' => [
                'id' => $shindig->slug(),
                'name' => $shindig->name,
                'timezone' => $shindig->timezone,
                'eventDate' => $shindig->event_date ? $shindig->event_date->toDateString() : '',
            ]
        ];
        return response()->json($data);
    }


    public function store(SaveShindigRequest $request)
    {
        return $this->save($request, new Shindig());
    }

    private function save(SaveShindigRequest $request, Shindig $shindig)
    {
        $params = $request->validated();

        // You can only change the event date if the event
        // is not activated yet.
        if (!$shindig->payment_status) {
            $event_date = isset($params['event_date'])
                ? Carbon::parse($params['event_date'])
                : null;
            $shindig->event_date = $event_date;
            $shindig->send_event_timestamp = $event_date;
        }
        // if (!$shindig->is_activated) {
        //     $event_date = isset($params['event_date'])
        //         ? Carbon::parse($params['event_date'])
        //         : null;
        //     $shindig->event_date = $event_date;
        //     $shindig->send_event_timestamp = $event_date;
        // }

        $shindig->name = $params['name'];
        $shindig->city = $params['location']["city"];
        $shindig->state = $params['location']["state"];
        $shindig->country_code = $params['location']["country"];
        $shindig->timezone = $params['timezone'];

        if ($shindig->is_activated && isset($params['text_to_join'])) {
            $shindig->text_to_join = $params['text_to_join'];
        }

        if (isset($params['show_join_button'])) {
            $shindig->show_join_button = $params['show_join_button'];
        }

        $new = !$shindig->id;

        $shindigDate = $shindig->event_date;
        $user = User::find(auth()->user()->id);
        try {
            if (!isset($shindigDate)) {
                $shindigDate = '01/01/1970';
            }
            if ($new) {
                $shindig->primary_owner = $user->id;
                // New event
                $shindig->save();
                $shindig->owners()->attach(auth()->user()->id);
                $shindig->activate();

                //  $user = User::first();
                //  dd($shindig->fresh());
                try {
                //Pushing web notification on event creation 
                $notification_data = [
                    'message' => "Event Has Been created Successfully !",
                    'data' => $this->transform($shindig->fresh()),
                    'notify_type' => 'event_created'
                ];
                $user->notify(new Notifications($notification_data));
             
                $users_token = UserTokens::select('user_token')->where('user_id', $user->id)->value('user_token');
                if ($users_token) {
                    $data = [
                        'url' => env('APP_URL') . '/app/dashboard/event-settings'
                    ];
                    OneSignal::sendNotificationToUser(
                        'Your event "' . $shindig->name . '" has been created successfully',
                        $users_token,
                        $url = null,
                        $data,
                        $buttons = null,
                        $schedule = null
                    );
                }
            }
         catch (Exception $ex) {
            Log::error($ex->getMessage());
        }
                // //allocate the phone to user


                //Add the evennt's date to mailchimp

                $this->saveToMailchimp($user, $shindigDate);
            } else {
                $user = User::find($shindig->primary_owner);
                $event = Shindig::find($shindig->id);
                if (!$event->event_date) {
                    $this->saveToMailchimp($user, $shindig->event_date);
                } else {

                    $date = Carbon::parse($event->event_date)->format('Y-m-d');
                    // $subscriber = Newsletter::getMember($user->email);
                    if (Newsletter::isSubscribed($user->email)) {
                        $subscriber = Newsletter::getMember($user->email);
                        if ($subscriber['merge_fields']['EVENTDATE1'] && $subscriber['merge_fields']['EVENTDATE1'] == $date) {
                            Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE1' => $shindig->event_date]);
                        } else if ($subscriber['merge_fields']['EVENTDATE2'] && $subscriber['merge_fields']['EVENTDATE2'] == $date) {
                            Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE2' => $shindig->event_date]);
                        } else if ($subscriber['merge_fields']['EVENTDATE3'] && $subscriber['merge_fields']['EVENTDATE3'] == $date) {
                            Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE3' => $shindig->event_date]);
                        }
                    }
                }
                //update phone number renew date

                // $phoneNumber = PhoneNumber::where('shindig_id', $shindig->id)->first();
                // if ($phoneNumber) {
                //     $phoneNumber->renews_at = $shindig->event_date->addDays(30);
                //     $phoneNumber->save();
                // }


                //updating event on mailchimp

            }
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
        }

        $shindig->save();

        //Pushing web notification on event updation 
        // $notification_data=[
        //     'message'=> "Event Has Been updated Successfully !",
        //     'data'=> $shindig->fresh()
        //  ];
        // $user->notify(new Notifications( $notification_data) );

        $data = [
            'status' => 'success',
            'data' => $this->transform($shindig)
        ];
        return response()->json($data);
    }

    public function saveToMailchimp($user, $shindigDate)
    {
        $date1 = '';
        $date2 = '';
        $date3 = '';
        try {
            $subscriber = Newsletter::getMember($user->email);
            if (Newsletter::isSubscribed($user->email)) { //check if user is in textmyguests main list
                $subscriber = Newsletter::getMember($user->email);
                //get the date saved on mailchimp, if there is some event
                if ($subscriber['merge_fields']['EVENTDATE1']) {
                    $date1 = Carbon::createFromFormat('Y-m-d', $subscriber['merge_fields']['EVENTDATE1']);
                }
                if ($subscriber['merge_fields']['EVENTDATE2']) {
                    $date2 = Carbon::createFromFormat('Y-m-d', $subscriber['merge_fields']['EVENTDATE2']);
                }
                if ($subscriber['merge_fields']['EVENTDATE3']) {
                    $date3 = Carbon::createFromFormat('Y-m-d', $subscriber['merge_fields']['EVENTDATE3']);
                }


                //check if there is an event or not
                if (!$subscriber['merge_fields']['EVENTDATE1']) {
                    Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE1' => $shindigDate, 'EV_ACTIVE1' => 'Inactive']);
                } else if (!$subscriber['merge_fields']['EVENTDATE2']) {
                    Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE2' => $shindigDate, 'EV_ACTIVE2' => 'Inactive']);
                } else if (!$subscriber['merge_fields']['EVENTDATE3']) {
                    Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE3' => $shindigDate, 'EV_ACTIVE3' => 'Inactive']);
                } //check if some event is expired or not
                else if ($date1 && !($date1->isFuture())) {
                    Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE1' => $shindigDate, 'EV_ACTIVE1' => 'Inactive']);
                } else if ($date2 && !($date2->isFuture())) {
                    Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE2' => $shindigDate, 'EV_ACTIVE2' => 'Inactive']);
                } else if ($date3 && !($date3->isFuture())) {
                    Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE3' => $shindigDate, 'EV_ACTIVE3' => 'Inactive']);
                }
            } else { //if not then check users exists in planner list


                if (Newsletter::isSubscribed($user->email, 'Textmyguests_Planner')) { //if exists then add this user to textmyguests main list with data.
                    $subscriber = Newsletter::getMember($user->email, 'Textmyguests_Planner');
                    //get the date saved on mailchimp, if there is some event
                    if ($subscriber['merge_fields']['EVENTDATE1']) {
                        $date1 = Carbon::createFromFormat('Y-m-d', $subscriber['merge_fields']['EVENTDATE1']);
                    }
                    if ($subscriber['merge_fields']['EVENTDATE2']) {
                        $date2 = Carbon::createFromFormat('Y-m-d', $subscriber['merge_fields']['EVENTDATE2']);
                    }
                    if ($subscriber['merge_fields']['EVENTDATE3']) {
                        $date3 = Carbon::createFromFormat('Y-m-d', $subscriber['merge_fields']['EVENTDATE3']);
                    }


                    //check if there is an event or not
                    if (!$subscriber['merge_fields']['EVENTDATE1']) {
                        Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE1' => $shindigDate, 'EV_ACTIVE1' => 'Inactive'], 'Textmyguests_Planner');
                    } else if (!$subscriber['merge_fields']['EVENTDATE2']) {
                        Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE2' => $shindigDate, 'EV_ACTIVE2' => 'Inactive'], 'Textmyguests_Planner');
                    } else if (!$subscriber['merge_fields']['EVENTDATE3']) {
                        Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE3' => $shindigDate, 'EV_ACTIVE3' => 'Inactive'], 'Textmyguests_Planner');
                    } //check if some event is expired or not
                    else if ($date1 && !($date1->isFuture())) {
                        Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE1' => $shindigDate, 'EV_ACTIVE1' => 'Inactive'], 'Textmyguests_Planner');
                    } else if ($date2 && !($date2->isFuture())) {
                        Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE2' => $shindigDate, 'EV_ACTIVE2' => 'Inactive'], 'Textmyguests_Planner');
                    } else if ($date3 && !($date3->isFuture())) {
                        Newsletter::subscribeOrUpdate($user->email, ['EVENTDATE3' => $shindigDate, 'EV_ACTIVE3' => 'Inactive'], 'Textmyguests_Planner');
                    }
                }
            }
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
        }
    }



    public function update(SaveShindigRequest $request, Shindig $shindig)
    {
        return $this->save($request, $shindig);
    }

    public function destroy(Shindig $shindig)
    {
        $shindig->delete();
        return response()->json(['status' => 'success']);
    }

    public function dashboard(Shindig $shindig)
    {
        $data = [
            'status' => 'success',
            'data' => [
                'counts' => [
                    'messages' => $shindig->messages()->count(),
                    'guests' => $shindig->guests()->count(),
                    'groups' => $shindig->groups()->count(),
                ]
            ]
        ];

        return response()->json($data);
    }

    public function owners(Shindig $shindig)
    {
        $shindig->load(['invitations.user', 'owners']);
        $invitations = $shindig->invitations()
            ->where('accepted', false)->get()
            ->map(function ($invitation) {
                $name = $invitation->user
                    ? $invitation->user->first_name . ' ' . $invitation->user->last_name
                    : 'Unknown';

                return [
                    'id' => 'i_' . $invitation->id,
                    'email' => $invitation->email,
                    'name' => $name,
                    'invitation' => true,
                ];
            });
        $owners = $shindig->owners->map(function ($owner) {
            return [
                'id' => $owner->id,
                'name' => $owner->first_name . ' ' . $owner->last_name,
                'email' => $owner->email,
                'invitation' => false,
            ];
        });
        $data = $owners->concat($invitations)->all();
        return response()->json($data);
    }

    public function removeOwner(Request $request, Shindig $shindig, $id)
    {
        if ($shindig->owners()->count() > 1) {
            $shindig->owners()->detach($id);
            return response()->json([
                'status' => 'success',
                'data' => $id,
            ]);
        }
        return response()->json([
            'status' => 'failed',
            'data' => [
                'message' => 'Can\'t delete last owner',
            ],
        ], 409);
    }

    private function chargeCard(Shindig $shindig, $token, $price, $invoice_line_items)
    {
        $user = auth()->user();

        // Configure stripe
        $stripe_key = env('STRIPE_SECRET');
        \Stripe\Stripe::setApiKey($stripe_key);


        // Charge the card
        $amount_paid = $price;
        $description = isset($invoice_line_items[0]) ? $invoice_line_items[0]['description'] : "TextMyGuests";
        $charge = \Stripe\Charge::create([
            'amount' => $amount_paid,
            'currency' => 'usd',
            'source' => $token, // Obtained client side
            'description' => $description . ': ' . $shindig->name . ' by ' . $user->first_name . ' ' . $user->last_name . ' (' . $user->email . ')',
        ]);

        // Get card details
        $card = $charge->payment_method_details->card;


        if ($card) {
            // Create the invoice
            $invoice = Invoice::where('user_id', $shindig->primary_owner)
                ->where('shindig_id', $shindig->id)
                ->first();


            if ($invoice) {
                //if invoice exists then update
                $invoice->user_id = auth()->user()->id;
                $invoice->stripe_id = $charge->id;
                $invoice->paid_amount = $charge->amount;
                $invoice->paid_at = Carbon::now();
                $invoice->card_type = $card->brand;
                $invoice->card_last4 = $card->last4;
                $invoice->save();
            } else {
                //if not then create new invoice
                $invoice = new Invoice();
                $invoice->user_id = auth()->user()->id;
                $invoice->shindig_id = $shindig->id;
                $invoice->stripe_id = $charge->id;
                $invoice->paid_amount = $charge->amount;
                $invoice->paid_at = Carbon::now();
                $invoice->card_type = $card->brand;
                $invoice->card_last4 = $card->last4;
                $invoice->save();
            }


            // Create the invoice line item
            foreach ($invoice_line_items as $item) {
                $line_item = new InvoiceLineItem();
                $line_item->name = $item['description'];
                $line_item->invoice_id = $invoice->id;
                $line_item->each_price = $item['line_credits'] > 0 ?
                    $item['line_price'] / $item['line_credits']
                    : 0;
                $line_item->quantity = $item['line_credits'];
                $line_item->line_price = $item['line_price'];
                $line_item->line_credits = $item['line_credits'];
                $line_item->save();
            }

            return $invoice;
        } else {
            return response()->json([
                'message' => 'A problem occured while trying to activate your event.  You were not charged anything.'
            ], 500);
        }
    }

    /**
     * Refunds an amount from the activation cost of the event
     */
    private function refund(Shindig $shindig, Invoice $invoice_to_refund, $amount, $description)
    {
        $user = auth()->user();
        // Get all invoices and make sure the user has a balance
        // greater than or equal to the refunded amount
        $balance = 0;
        foreach ($user->invoices as $invoice) {
            $balance += $invoice->paid_amount;
        };

        if ($balance < $amount * 100) {
            throw new \Exception('Not enough fund.');
        }
        if (!$invoice_to_refund) {
            throw new \Exception('No invoice to refund.');
        }
        if (!$invoice_to_refund->stripe_id) {
            throw new \Exception('No stripe_id.');
        }

        // Configure stripe
        $stripe_key = env('STRIPE_SECRET');
        \Stripe\Stripe::setApiKey($stripe_key);

        $refund = \Stripe\Refund::create([
            'charge' => $invoice_to_refund->stripe_id,
            'amount' => $amount * 100, // in cents
        ]);

        $user = User::find($shindig->primary_owner);


        // Create the invoice
        $invoice = new Invoice();
        $invoice->user_id = $user->id;
        $invoice->shindig_id = $shindig->id;
        $invoice->stripe_id = $refund->id;
        $invoice->paid_amount = $refund->amount * -1;
        $invoice->paid_at = Carbon::now();
        $invoice->card_type = $invoice_to_refund->card_type;
        $invoice->card_last4 = $invoice_to_refund->card_last4;
        $invoice->save();

        // Create the invoice line item
        $lineItem = new InvoiceLineItem();
        $lineItem->name = $description;
        $lineItem->invoice_id = $invoice->id;
        $lineItem->each_price = 0;
        $lineItem->quantity = 0;
        $lineItem->line_price = $refund->amount * -1;
        $lineItem->line_credits = 0;
        $lineItem->save();

        return $invoice;
    }

    public function activateShindig(ActivateShindigRequest $request, Shindig $shindig)
    {
        $params = $request->validated();
        // Check how much user should be paying
        $activation_price = 149; // $149.00
        $discount_percentage = $shindig->discount()->percentage;
        $discount = ($discount_percentage / 100) * $activation_price;
        $promotion = isset($params['promotion']) && $params['promotion'] === 'share50' ? 50 : 0;
        // Discount is applied first, then promotion
        $discounted_price = 0;
        if ($params['promoId'] > 0) {
            $promocode = Promocode::find($params['promoId']);
            if (isset($promocode)) {
                if ($promocode->type === 'fixed') {
                    if ($promocode->price >= $activation_price) {
                        $discounted_price = $activation_price;
                    } else {
                        $discounted_price = $promocode->price;
                    }
                } else {
                    $discounted_price = ($activation_price * $promocode->price) / 100;
                }
            }
        }


        $should_pay = $activation_price - $discount - $discounted_price - $promotion;
        //here we have change is_activated to payment_status for new requriement
        // Prepare line items for the invoice
        $new_credits = $shindig->payment_status ? 0 : 500; // We don't add new credits on second activation.
        $invoice_line_items = [
            ['description' => 'Event activation', 'line_price' => $activation_price * 100, 'line_credits' => $new_credits]
        ];
        if ($discount > 0) {
            $invoice_line_items[] = ['description' => $discount_percentage . '% discount', 'line_price' => $discount * -100, 'line_credits' => 0];
        }
        if ($promotion > 0) {
            $invoice_line_items[] = ['description' => 'Promotion - $50 Off', 'line_price' => $promotion * -100, 'line_credits' => 0];
        }

        // We cannot process payments smaller than 1$
        // So we round it up to 1
        if ($should_pay < 1) {
            $should_pay = 1;
        }

        // Return error if price is 0
        if ($should_pay <= 0) {
            return response()->json([
                'message' => 'We cannot process payments of $0.',
            ], 500);
        }

        // Make sure the price to pay is the same as displayed on front end
        if (intval($should_pay) !== intval($params['totalPrice'])) {
            return response()->json([
                'message' => 'A problem occured while trying to activate your event.  You were not charged anything.',
                'data' => $should_pay,
            ], 500);
        }

        // Charge the credit card, send invoice, save the date and activate
        try {
            // TODO: I think we should add some more protection against any of the
            // following steps failing
            $invoice = $this->chargeCard(
                $shindig,
                $params['token'],
                intval($should_pay * 100), // From dollars to cents.
                $invoice_line_items
            );

            if (isset($params['promoId'])) {
                if ($params['promoId'] > 0) {
                    //save the promo code record...
                    $promodetail = new PromoDetail();
                    $promodetail->user_id = auth()->user()->id;
                    $promodetail->shindig_id = $shindig->id;
                    $promodetail->promocode_id = $params['promoId'];
                    $promodetail->save();

                    $promocode = Promocode::find($params['promoId']);
                    $promocode->used_globally = $promocode->used_globally + 1;
                    $promocode->save();
                }
            }

            // Send invoice by email
            $invoice->emailActivationInvoice();

            $shindig->event_date = Carbon::parse($params['event_date']);

            if (isset($params['promotion']) && $params['promotion'] === 'share50') {
                $shindig->addPromotionalMessage();
            }

            $shindig->save();
            $shindig->activatePaymentStatus();

            $user = User::find(auth()->user()->id);
            try {
            $notification_data = [
                'message' => "Payment has been done and your event is now activated!",
                'data' => $this->transform($shindig->fresh()),
                'notify_type' => 'payment_done'
            ];
            $user->notify(new Notifications($notification_data));
        
            $users_token = UserTokens::select('user_token')->where('user_id', $user->id)->value('user_token');
            if ($users_token) {
                $data = [
                    'url' => env('APP_URL') . '/app/dashboard/invoices'
                ];
                OneSignal::sendNotificationToUser(
                    'Your event "' . $shindig->name . '" has been activated',
                    $users_token,
                    $url = null,
                    $data,
                    $buttons = null,
                    $schedule = null
                );
            }
        }
        catch (Exception $ex) {
           Log::error($ex->getMessage());
       }

            event(new ChangeActivationStatus($shindig));

            return response()->json([
                'status' => 'success',
                'data' => $this->transform($shindig->fresh()),
            ]);
        } catch (\Stripe\Error\Base $e) {
            return response()->json([
                'status' => 'failure'
            ], 500);
        }
    }

    public function optOutPromotion(PromotionRequest $request, Shindig $shindig)
    {
        $params = $request->validated();

        /**
         * 1. Client pays 50$
         * 2. Send invoice by email
         * 3. We remove the promotional message
         */

        if ($params['promotion'] === 'share50') {
            // Make sure the price to pay is the same as displayed on front end
            if (intval($params['price']) !== 50 || !$params['token']) {
                return response()->json([
                    'message' => 'A problem occured while trying to opt out of the promotion. You were not charged anything.'
                ], 500);
            }

            try {
                // TODO: I think we should add some more protection against any of the
                // following steps failing
                $invoice = $this->chargeCard(
                    $shindig,
                    $params['token'],
                    5000, // 5000 cents = $50
                    [[
                        'description' => 'Opting out of $50 promotion',
                        'line_price' => 5000,
                        'line_credits' => 0
                    ]]
                );

                $invoice->emailInvoice(
                    "You opted out of the promotional message",
                    "Your payment of $50 has been received and the promotional message is now removed from your event. You can view your invoice at the link below. If you change your mind and want to help spread the word about TextMyGuests (and get your $50 back), simply opt back in from your dashboard. Please reply to this email if you have any questions. Thank you for using TextMyGuests!"
                );

                $shindig->messages()->where('promotion', 'share50')->delete();
            } catch (\Stripe\Error\Base $e) {
                return response()->json([
                    'status' => 'failure'
                ], 500);
            }
        }

        // Return messages
        $shindig->load('messages.recipients');
        $messages = $shindig->messages->map(function ($message) {
            return MessageController::transform($message, $message->shindig->timezone);
        });
        $data = [
            'status' => 'success',
            'data' => [
                'messages' => $messages
            ]
        ];
        return response()->json($data);
    }

    /**
     * Opt in promotion after activating the event. Client gets a refund.
     */
    public function optInPromotion(PromotionRequest $request, Shindig $shindig)
    {
        $params = $request->validated();

        $price = 0;
        if ($params['promotion'] === 'share50') {
            $price = 50;
        }

        if (intval($params['price']) !== $price || !isset($params['invoice_id'])) {
            return response()->json([
                'message' => 'A problem occured while trying to opt you in the promotion.'
            ], 500);
        }

        // Refund the price of the promotion
        try {
            $invoice = Invoice::find($params['invoice_id']);
            $refund_invoice = $this->refund($shindig, $invoice, $price, "Promotional message discount");
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'Transaction failed',
                'error' => $e
            ], 500);
        }

        // Send invoice by email
        $refund_invoice->emailInvoice(
            "You were refunded $50",
            "Thank you! We've refunded $50 to your method of purchase as a token of our appreciation for helping us spread the word about TextMyGuests! A promotional message has been added to the end of your event. You can view your updated invoice at the link below, or any time from your account dashboard. Please reply to this email if you have questions. Thank you for using and sharing TextMyGuests!"
        );

        // Add the promotional message to the event
        $shindig->addPromotionalMessage();

        // Return messages
        $shindig->load('messages.recipients');
        $messages = $shindig->messages->map(function ($message) {
            return MessageController::transform($message, $message->shindig->timezone);
        });
        $data = [
            'status' => 'success',
            'data' => [
                'messages' => $messages
            ]
        ];
        return response()->json($data);
    }

    /**
     * Old method to handle multiple plans and upgrades.
     * Kept in case we come back to a similar pricing model.
     * 
     */
    public function upgradeShindig(UpgradeShindigRequest $request, Shindig $shindig)
    {
        $params = $request->validated();

        // Get the current number of credits and the amount paid
        $current_credits = $shindig->paidGuestLimit();
        $value_of_current_plan = 0;

        $best_plan = $this->plans['tier3'];
        $total_credits = $current_credits + $params['credits'];

        // If the current total of credits is over the highest tier,
        // it means user bought credits at the flat rate
        if ($current_credits > $best_plan['credits']) {
            $value_of_current_plan = $current_credits * $this->flat_rate;
        } else if ($current_credits !== 0) {
            $current_plan = null;
            foreach ($this->plans as $plan) {
                if ($current_credits === $plan['credits']) {
                    $current_plan = $plan;
                }
            }
            $value_of_current_plan = $current_plan['price'];

            // If the current plan is not found, return error
            if (!$current_plan) {
                return response()->json([
                    'message' => 'Sorry, we could not find the plan you are trying to activate.',
                ], 500);
            }
        }

        // If the new total of credits is over the highest tier,
        // it means user is buying credits at the flat rate
        if ($total_credits > $best_plan['credits']) {
            $full_price = $total_credits * $this->flat_rate;
            $price_before_discount = $full_price - $value_of_current_plan;
        } else {
            $selected_plan = null;
            foreach ($this->plans as $plan) {
                if ($total_credits === $plan['credits']) {
                    $selected_plan = $plan;
                }
            }
            $price_before_discount = $selected_plan['price'] - $value_of_current_plan;

            // If the selected plan is not found, return error
            if (!$selected_plan) {
                return response()->json([
                    'message' => 'Sorry, we could not find the plan you are trying to activate.',
                ], 500);
            }
        }

        // Apply discount if any
        $discount = ($shindig->discount()->percentage / 100) * $price_before_discount;
        $price_to_pay = $price_before_discount - $discount;

        // Return error if price is 0
        if ($price_to_pay <= 0) {
            return response()->json([
                'message' => 'We cannot process payments of $0.',
            ], 500);
        }

        // We cannot process payments smaller than 1$
        // So we round it up to 1
        if ($price_to_pay < 1) {
            $price_to_pay = 1;
        }

        // Make sure the price to pay is the same as displayed on front end
        if (intval($price_to_pay) !== intval($params['price'])) {
            return response()->json([
                'message' => 'A problem occured while trying to upgrade your event.'
            ], 500);
        }

        try {
            $this->chargeCard(
                $shindig,
                $params['token'],
                intval($price_to_pay * 100), // from dollars to cents
                [[
                    'description' => 'Add ' . $params['credits'] . ' Guest Credits',
                    'line_price' => intval($price_to_pay * 100),
                    'line_credits' => $params['credits']
                ]]
            );
            return response()->json([
                'status' => 'success',
                'data' => $this->transform($shindig->fresh()),
            ]);
        } catch (\Stripe\Error\Base $e) {
            return response()->json([
                'status' => 'failure'
            ], 500);
        }
    }

    public function transform(Shindig $shindig)
    {
        // dd($shindig);
        $total_credits = $shindig->paidGuestLimit();
        $spent_credits = $shindig->guests()->count();
        return [
            'id' => $shindig->slug(),
            'name' => $shindig->name,
            'location' => [
                'city' => $shindig->city,
                'state' => $shindig->state,
                'country' => $shindig->country_code,
            ],
            'timezone' => $shindig->timezone,
            'payment' => [
                'activated' => $total_credits > 15,
                'total_credits' => $total_credits,
                'spent_credits' => $spent_credits,
                'remaining_credits' => $total_credits - $spent_credits,
                'discount' => $shindig->discount()->percentage,
                'discount_owner' => $shindig->discount()->owner
            ],
            'eventDate' => $shindig->event_date ? $shindig->event_date->toDateString() : '',
            'isStreamPublic' => $shindig->is_stream_public,
            'textToJoin' => $shindig->text_to_join,
            'showJoinButton' => $shindig->show_join_button,
            'phoneNumbers' => $shindig->phoneNumbers->map(function ($phoneNumber) {
                return $phoneNumber->number;
            }),
            'hideOnboarding' => $shindig->hide_onboarding,
            'expiry' => $shindig->phoneNumbers->map(function ($phoneNumber) {
                return !is_null($phoneNumber->renews_at)&&$phoneNumber->renews_at->format('Y-m-d');
            })
        ];
    }

    public function replyStream(Request $request, Shindig $shindig)
    {
        $messages_and_replies = $shindig->payment_status
            ? $this->replies($shindig, false)
            : [];

        return response()->json([
            'status' => 'success',
            'data' => $messages_and_replies
        ]);
    }

    public function publicReplyStream(Request $request, Shindig $shindig)
    {

        if ($shindig->is_stream_public) {
            $messages_and_replies = $this->replies($shindig, true);
        } else {
            return response('Unauthorized', 401);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'replies' => $messages_and_replies,
                'showJoinButton' => $shindig->show_join_button
            ]
        ]);
    }

    public function replies(Shindig $shindig, $public_stream = false)
    {
        // We get messages that were sent and reformat them
        $messages_sent = $shindig->messages()->whereNotNull('sent');

        if ($public_stream) {
            $messages_sent->where('hidden', false);
        }

        $messages = $messages_sent->get()
            ->map(function ($m) {
                return MessageController::transformForReplyStream($m);
            });

        // We get replies and format them
        $replies_received = $shindig->InboundSMS();

        if ($public_stream) {
            $replies_received->where('hidden', false);
        }

        $replies = $replies_received->get()
            ->map(function ($sms) {
                return SMSController::transformForReplyStream($sms);
            })->reject(function ($sms) {
                // transformForReplyStream returns null if there is a problem
                // with the sms.
                return $sms === null;
            });

        // We interleave messages and replies and order them by date
        $messages_and_replies = $messages->concat($replies)
            ->sortByDesc('received_at')
            ->values();

        return $messages_and_replies;
    }

    public function toggleStreamPublic(Request $request, Shindig $shindig)
    {
        try {
            $new_value = $request->isStreamPublic ? 1 : 0;
            $shindig->is_stream_public = $new_value;
            $shindig->save();
            return response()->json([
                'status' => 'success',
                'data' => $this->transform($shindig),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'failure'
            ], 500);
        }
    }

    public function hideOnboarding(Request $request, Shindig $shindig)
    {

        $shindig->hide_onboarding = true;
        $shindig->save();

        return response()->json([
            'status' => 'success',
            'data' => $this->transform($shindig),
        ]);
    }
    public function returnEvent()
    {
        $event = Shindig::find(41);
        return $event->owners()->get();
    }
}
