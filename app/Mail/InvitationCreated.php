<?php

namespace App\Mail;

use App\Shindig;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class InvitationCreated extends Mailable
{
    use Queueable, SerializesModels;
    public $invitation;
    public $shindig;
    public $user;
    public $link;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(\App\Invitation $invitation, $shindig, \App\User $user, $link)
    {
        $this->invitation = $invitation;
        $this->shindig = $shindig;
        $this->user = $user->first_name . ' ' . $user->last_name;
        $this->link = $link;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('no-reply@textmyguests.com')->view('emails.invitation');
    }
}
