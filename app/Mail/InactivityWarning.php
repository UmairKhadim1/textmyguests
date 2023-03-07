<?php

namespace App\Mail;

use App\Shindig;
use App\PhoneNumber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class InactivityWarning extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * All public variables on this Mailable are available to the view
     */

    public $expiry_date;
    public $shindig;
    public $number;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Shindig $shindig, PhoneNumber $number, $expiry_date)
    {
        $this->shindig = $shindig;
        $this->number = $number;
        $this->expiry_date = $expiry_date;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.inactivitywarning');
    }
}
