<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendImages extends Mailable
{
    use Queueable, SerializesModels;
    public $shindig, $subject, $content, $zip_url;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($shindig, $subject, $content, $zip_url)
    {
        $this->shindig = $shindig;
        $this->subject = $subject;
        $this->content = $content;
        $this->zip_url = $zip_url;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.sendImages')->subject($this->subject)->attach($this->zip_url, ['as' => $this->shindig->name . '.zip', 'mime' => 'application/zip']);
    }
}
