<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class EventExpireAfterThreeDays extends Mailable
{
    use Queueable, SerializesModels;
    public $event;
    public $user;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($event, \App\User $user)
    {
        $this->event = $event;
        $this->user = $user->first_name . ' ' . $user->last_name;
    }
    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('no-reply@textmyguests.com')->view('emails.eventExpireAfterThreeDays');
    }
}
