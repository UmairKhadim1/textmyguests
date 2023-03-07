<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Invoice;

class EventActivated extends Mailable
{
    use Queueable, SerializesModels;

    public $invoice_url;

    public $shindig_name;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Invoice $invoice)
    {
        $this->invoice_url = $invoice->url();
        $this->shindig_name = $invoice->shindig->name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.eventActivated')
            ->subject($this->shindig_name . ' is activated!');
    }
}
