<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Twilio\Rest\Client;

class MessagingService extends Model
{
    public $table = 'messaging_services';

    public function generateMessagingService()
    {
        $sid = env('TWILIO_LIVE_SID', null);
        $token = env('TWILIO_LIVE_TOKEN', null);
        if ($sid == null || $token == null) {
            return false; // env not properly configured
        }

        $twilio = new Client($sid, $token);

        $service = $twilio->messaging->v1->services->create("Textmyguests Message Service");

        $this->messagingServiceSid = $service->sid;

        // configure the Messaging Service
        $result = $twilio->messaging->v1->services($service->sid)->update(array(
            "friendlyName" => "Textmyguests Message Service",
            "validityPeriod" => "1800", // 30 minutes,
            "inboundRequestUrl" => env('APP_URL', 'https://textmyguests.com') . "/handleInboundSMS",
            "statusCallback" => env('APP_URL', 'https://textmyguests.com') . "/handleSMSCallback",
            //"inboundRequestUrl" => str_replace('http://', 'https://', route('handleSMS')),
            //"inboundRequestUrl" => str_replace('http://', 'https://', route('SMScallback')),
        ));

        return $result;
    }
}
