<?php

namespace App\Observers;

use App\Shindig;
use App\Message;
use App\MessageRecipient;

class MessageObserver
{
    public function creating(Message $message)
    {
        /* uncomment to limit unactivated events to 3 messages
        $shindig = Shindig::find($message->shindig_id);

        $message_count = $shindig->messageCount();

        if (!$shindig->is_activated)
        {
            if ($message_count >= 3)
                return false;
        }
        */
    }

    public function saving(Message $message)
    {
        // hard truncate Message contents to 160 characters in length before saving - use mb_substr() to be emoji-safe
        $message->contents = mb_substr(trim($message->contents), 0, 160);

        // If the event has a promotional message to send at the end of the event,
        // and if the saved message becomes the latest message of the event,
        // reschedule the promotional message.
        $shindig = $message->shindig;
        if (
            !$message->promotion &&
            $message->send_at->greaterThan($shindig->event_date) &&
            in_array('share50', $shindig->promotions())
        ) {
            $shindig_latest_message = $shindig
                ->messages()
                ->whereNull('promotion')
                ->latest('send_at')
                ->first();

            if (
                !$shindig_latest_message ||
                $shindig_latest_message->send_at->lessThan($message->send_at)
            ) {
                $shindig->messages()
                    ->where('promotion', 'share50')
                    ->whereNull('sent')
                    ->update([
                        'send_at' => $message->send_at
                            ->setTimezone($shindig->timezone)
                            ->addDay()
                            ->startOfDay()
                            ->addHours(11)
                            ->setTimezone('UTC')
                    ]);
            }
        }
    }

    public function deleting(Message $message)
    {
        // If the message being deleted is the latest message after the event date
        // and there is a promotional message sent at the end of the event,
        // we need to reschedule the promotional message.
        $shindig = $message->shindig;
        if (
            $message->send_at->greaterThan($shindig->event_date) &&
            in_array('share50', $shindig->promotions())
        ) {
            // Get the 2 latest messages sent after the event
            $shindig_latest_messages = $shindig
                ->messages()
                ->whereNull('promotion')
                ->where('send_at', '>', $shindig->event_date)
                ->latest('send_at')
                ->take(2)
                ->get();

            // If the deleted message was the latest
            if (!$shindig_latest_messages->first() || $message->id === $shindig_latest_messages->first()->id) {
                // If there is no other message scheduled after the event, the promotional
                // message  must be scheduled the day after the event at 11 AM.
                if (!isset($shindig_latest_messages[1])) {
                    $tz_offset = $shindig->event_date->setTimezone($shindig->timezone)->getOffset() / 3600; // Timezone offset in hours
                    $send_at = $shindig->event_date
                        ->addDay()
                        ->startOfDay()
                        ->addHours(11 - $tz_offset);
                } else {
                    // Else, the promotional message must be scheduled the day
                    // after the new latest message.
                    $new_latest_message = $shindig_latest_messages[1];
                    $send_at = $new_latest_message->send_at
                        ->setTimezone($shindig->timezone)
                        ->addDay()
                        ->startOfDay()
                        ->addHours(11)
                        ->setTimezone('UTC');
                }

                // Update the promotional message
                $shindig->messages()
                    ->where('promotion', 'share50')
                    ->update(['send_at' => $send_at]);
            }
        }
    }

    public function deleted(Message $message)
    {
        // remove all the message's recipeints when it is deleted
        MessageRecipient::where('message_id', $message->id)->delete();
    }
}
