<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Balping\HashSlug\HasHashSlug;
use Mail;
use App\Mail\EventActivated;
use App\Mail\SendInvoice;

class Invoice extends Model
{
    use HasHashSlug;
    protected static $minSlugLength = 9;

    protected $guarded = ['id'];
    protected $dates = ['created_at', 'updated_at', 'paid_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shindig()
    {
        return $this->belongsTo(Shindig::class)->withTrashed();
    }

    public function lineItems()
    {
        return $this->hasMany(InvoiceLineItem::class);
    }

    public function addLineItem(InvoiceLineItem $line_item)
    {
        // creates a new InvoiceLineItem on this Invoice and keep total_credits and total_price up to date
        $line_item->invoice_id = $this->id;
        return $line_item->save();
    }

    public function emailActivationInvoice()
    {
        Mail::to($this->user->email)->queue(new EventActivated($this));
    }

    public function emailInvoice($subject, $message)
    {
        Mail::to($this->user->email)->queue(new SendInvoice(
            $subject,
            $message,
            $this->url()
        ));
    }

    public function url()
    {
        return env('APP_URL', 'https://textmyguests.com') . "/invoices/" .  $this->slug();
    }

    public function chargeUser(User $user)
    {
        // charge whichever User for this invoice using their payment method
    }
}
