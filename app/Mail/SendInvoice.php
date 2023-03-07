<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendInvoice extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;

    public $content;

    public $invoice_url;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($subject, $content, $invoice_url)
    {
        $this->subject = $subject ?? "New invoice";
        $this->content = $content ?? "A new invoice was created for you.";
        $this->invoice_url = $invoice_url ?? "#";
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.sendInvoice')
            ->subject($this->subject);
    }
}
