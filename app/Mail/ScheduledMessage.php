<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ScheduledMessage extends Mailable
{
    use Queueable, SerializesModels;
    public $msg;
    public $user;
     /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct( $msg, \App\User $user)
    {
      $this->msg = $msg;
        $this->user = $user->first_name . ' ' . $user->last_name;
 
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('no-reply@textmyguests.com')->view('emails.scheduleMessage');
    } 
}
