<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\User;

class ContactUs extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;
    public $body_message;
    public $user;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($subject, $message, User $user)
    {
        $this->subject = $subject;
        $this->body_message = $message;
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from($this->user->email)
            ->subject($this->subject)
            ->view('emails.contactus');
    }
}
