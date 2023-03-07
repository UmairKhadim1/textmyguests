<?php

namespace App\Mail;

use App\Shindig;
use App\PhoneNumber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NumberDeleted extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * All public variables on this Mailable are available to the view
     */

    public $shindig;
    public $number;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Shindig $shindig, PhoneNumber $number)
    {
        $this->shindig = $shindig;
        $this->number = $number;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.numberdeleted');
    }
}
