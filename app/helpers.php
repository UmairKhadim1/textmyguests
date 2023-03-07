<?php

namespace App;

use Carbon\Carbon;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

if (!function_exists('sendSMS2')) {
    function sendSMS2($to, $body, $media_url = NULL, $msg_srv_sid = NULL, $msg_id = NULL, $phone_number = NULL)
    {
        // don't go any further if we don't have a valid phone number
        $to = validatePhone($to);
        if (!$to)
            return false;

        $sid = env('TWILIO_LIVE_SID', NULL);
        $token = env('TWILIO_LIVE_TOKEN', NULL);

        if ($sid == NULL || $token == NULL)
            return false; // env not properly configured, cannot send

        // use the default messaging service if no from number is specified
        if ($msg_srv_sid == NULL)
            $msg_srv_sid = env('TWILIO_MSGSRV_SID', NULL);
        if ($msg_srv_sid == NULL) // if still NULL
            return false; // env not properly configured, cannot send


        //if phone number is null 
        if (!isset($phone_number) || $phone_number == NULL) {
            $phone_number = '+18456689502';
        }
        $twilio = new Client($sid, $token);

        $msg = array(
            'from' => $phone_number,
            'messagingServiceSid' => $msg_srv_sid,
            'body' => stripcslashes($body),
            'statusCallback' => str_replace('http://', 'https://', route('SMScallback')) // give appropriate URL depending on env
            //'StatusCallback' => 'https://textmyguests.com/handleSMSCallback' // hardcode production callback URL
        );

        // only add the media_url parameter if it exists (validation is handled on the Message object w/ an accessor function)
        if ($media_url)
            $msg['mediaUrl'] = $media_url;

        // Send the message

        try {
            $sms = $twilio->messages->create($to, $msg);
        } catch (\Exception $e) {
            // this is here for when Twilio returns an error for invalid phone numbers - example +18342704711
            Log::error($e->getMessage());
        }

        if ($sms) // sent successfully so record an activity
        {
            \App\Activity::create([
                'message_id' => $msg_id,
                'fromPhone' => $phone_number, // to be filled out later after delivery
                'toPhone' => $sms->to,
                'body' => $body,
                //'media_url' => $media_url, // we don't currently store this in the activities table (no column)
                'occurred_at' => Carbon::now(),
                'messageSid' => $sms->sid,
                'messagingServiceSid' => $sms->messagingServiceSid,
                'twilioStatus' => $sms->status // will be updated again after delivery
            ]);
        }

        return $sms; // important to return an object so message details can be retrived by the calling code
    }
}

if (!function_exists('validatePhone')) {
    function validatePhone($number)
    {
        // for some reason the validator passes '', so we need to check that manually
        if (empty($number))
            return NULL;

        $validator = Validator::make(['guest_phone' => $number], [
            'guest_phone' => 'phone:AUTO,US',
        ]);

        if ($validator->fails()) {
            return NULL;
        } else
            return phone($number, 'US')->formatE164();
    }
}

if (!function_exists('str_starts_with')) {
    function str_starts_with($haystack, $needle)
    {
        return strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}
