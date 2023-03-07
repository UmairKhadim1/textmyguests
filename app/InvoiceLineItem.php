<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InvoiceLineItem extends Model
{
    protected $table = 'invoice_line_items';
    protected $guarded = ['id'];
    protected $dates = ['created_at', 'updated_at'];

    protected $touches = ['invoice']; // touch the object called by "invoice()" on update of this lineItem

    public function invoice()
    {
    	return $this->belongsTo('App\Invoice');
    }
}
