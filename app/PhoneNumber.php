<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use Twilio\Rest\Client;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;

class PhoneNumber extends Model
{
    use SoftDeletes;

    public $timestamps = false;
    protected $dates = ['provisioned_at', 'renews_at', 'deleted_at'];
    protected $guarded = [];

    public function shindig()
    {
        return $this->belongsTo('App\Shindig')->withDefault(function ($shindig) {
            $shindig->name = "Deleted Event";
            $shindig->location = "Not Available";
            $shindig->id = 0;
            $shindig->start_date = NULL;
            $shindig->end_date = NULL;
        });
    }

    public function provision()
    {
        // provision this phone number at Twilio
        // attempt to use the linked Shindig to derive preferred location

        $sid = env('TWILIO_LIVE_SID', NULL);
        $token = env('TWILIO_LIVE_TOKEN', NULL);
        if ($sid == NULL || $token == NULL)
            return false; // env not properly configured

        try {
            $twilio = new Client($sid, $token);

            // don't re-provision a number that already exists at Twilio
            if (!isset($this->sid)) {
                // only provision if this object is attached to a shindig
                if (isset($this->shindig_id) && ($this->shindig_id != 0)) {
                    $numbers = array();

                    if (isset($this->number)) {
                        // we already know the number we want - hope it's available
                        $numbers[0] = $this->number;
                    } else {
                        $twilio_options = array(
                            "excludeAllAddressRequired" => "true",
                            "voiceEnabled" => "true",
                            "smsEnabled" => "true",
                            "mmsEnabled" => "true",
                        );

                        // if the shindig has a location set, try to find a number close to it
                        if (isset($this->shindig->city) && isset($this->shindig->state)) {
                            $url = "https://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($this->shindig->city . "," . $this->shindig->state) . "&key=" . env('GOOGLE_MAPS_KEY');
                            $json_data = file_get_contents($url);
                            $result = json_decode($json_data, TRUE);
                            if (isset($result['results'][0]['geometry']['location']['lat']) && isset($result['results'][0]['geometry']['location']['lng'])) {
                                $lat = $result['results'][0]['geometry']['location']['lat'];
                                $lng = $result['results'][0]['geometry']['location']['lng'];
                                $twilio_options['nearLatLong'] = $lat . "," . $lng;
                            }

                            // try to get a number near the event
                            $numbers = $twilio->availablePhoneNumbers('US')->local->read($twilio_options);

                            if (count($numbers) == 0) {
                                // nothing nearby is available, just go for any old number
                                unset($twilio_options['nearLatLong']);
                                $numbers = $twilio->availablePhoneNumbers('US')->local->read($twilio_options);
                            }
                        }

                        // if shindig has no location, any old number will do
                        else {
                            $numbers = $twilio->availablePhoneNumbers('US')->local->read($twilio_options);
                        }
                    }

                    // buy the first number on the list
                    $number = $twilio->incomingPhoneNumbers->create(array(
                        "phoneNumber" => $numbers[0]->phoneNumber,
                    ));

                    // remember what we just bought
                    $this->sid = $number->sid;
                    $this->number = $number->phoneNumber;
                    $this->country = "US";
                    $this->provisioned_at = Carbon::now()->subSeconds(1);
                    $this->renews_at = Carbon::now()->addMonthsNoOverflow(1);
                    $this->save();

                    $messagingService = MessagingService::latest('id')->first();
                    // $messagingService = null;
                    // $messagingservices = MessagingService::all();
                    // foreach ($messagingservices as $msg) {
                    //     if ($msg->usedService < $msg->totalLimit) {
                    //         $messagingService = $msg;
                    //         break;
                    //     }
                    // }
                    if ($messagingService && $messagingService->usedService < $messagingService->totalLimit) {
                        $twilio->messaging->v1->services($messagingService->messagingServiceSid)->phoneNumbers->create($number->sid);
                        $messagingService->usedService = $messagingService->usedService + 1;
                        $this->shindig->messagingServiceSid = $messagingService->messagingServiceSid;
                        $this->shindig->save();
                        $messagingService->save();
                    } else {
                        $messagingService = new MessagingService();
                        $messagingService->generateMessagingService();
                        $this->shindig->messagingServiceSid = $messagingService->messagingServiceSid;
                        $this->shindig->save();
                        $twilio->messaging->v1->services($this->shindig->messagingServiceSid)->phoneNumbers->create($number->sid);
                        $messagingService->usedService = $messagingService->usedService + 1;
                        $messagingService->save();
                    }
                    // put the number into the Messaging Service for the shindig
                    // $twilio->messaging->v1->services($messagingService->messagingServiceSid)->phoneNumbers->create($number->sid);

                    // configure the phone number for our voice handler
                    $twilio->incomingPhoneNumbers($number->sid)->update(array(
                        "voiceUrl" => "https://textmyguests.com/handleIncomingCall",
                        // "" => "https://textmyguests.com/handleCallCallback"
                    ));
                    // dd($this->number);
                    return $this->number;
                } else
                    return false;
            } else
                return false;
        } catch (Exception $ex) {
            // dd($ex->getMessage());
            Log::error($ex->getMessage());
        }
    }

    public function release()
    {

        $sid = env('TWILIO_LIVE_SID', NULL);
        $token = env('TWILIO_LIVE_TOKEN', NULL);
        if ($sid == NULL || $token == NULL)
            return false; // env not properly configured

        $twilio = new Client($sid, $token);

        if (isset($this->sid)) {
            $twilio->incomingPhoneNumbers($this->sid)->delete();

            //decrease the messaging service counter
            $messagingService = MessagingService::where('messagingServiceSid', $this->shindig->messagingServiceSid)->first();
            if ($messagingService) {
                $messagingService->usedService = $messagingService->usedService - 1;
                $messagingService->save();
            }


            // Manually setting 'deleted_at' instead of calling $this->delete()
            // is intentional. There is an observer that releases a phone number
            // when it is deleted, so if we call $this->delete() from here, the
            // observer will try to release the phone number that we actually
            // just release, causing a 404 error from Twilio. Manually setting
            // 'deleted_at' doesn't invoke the observer.


            $this->deleted_at = Carbon::now();
            $this->save();
        } else
            return false;
    }
}
