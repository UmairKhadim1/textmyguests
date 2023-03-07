<?php

namespace App\Mail;

use App\Shindig;
use App\PhoneNumber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class PhoneNumberAboutToRelease extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * All public variables on this Mailable are available to the view
     */

    public $shindig;
    public $number;
    public $expiry_date;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(PhoneNumber $phone_number, $expiry_date)
    {
        $this->shindig = $phone_number->shindig;
        $this->number = $phone_number;
        $this->expiry_date = $expiry_date;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.phonenumberabouttorelease');
    }
}
