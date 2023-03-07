<?php

namespace App\Nova\Actions;

use Illuminate\Bus\Queueable;
use Laravel\Nova\Actions\Action;
use Illuminate\Support\Collection;
use Laravel\Nova\Fields\ActionFields;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Laravel\Nova\Fields\Number;

use App\Invoice;
use App\InvoiceLineItem;
use Carbon\Carbon;

class IncreaseGuestLimit extends Action
{
    use InteractsWithQueue, Queueable;

    /**
     * Perform the action on the given models.
     *
     * @param  \Laravel\Nova\Fields\ActionFields  $fields
     * @param  \Illuminate\Support\Collection  $models
     * @return mixed
     */
    public function handle(ActionFields $fields, Collection $models)
    {
        foreach ($models as $shindig) {
            $user = $shindig->owners()->first();
            // Create the invoice
            $invoice = new Invoice();
            $invoice->user_id = $user->id;
            $invoice->shindig_id = $shindig->id;
            $invoice->paid_amount = 0;
            $invoice->paid_at = Carbon::now();
            $invoice->save();

            // Create the invoice line item
            $line_item = new InvoiceLineItem();
            $line_item->name = "Additionnal guests";
            $line_item->invoice_id = $invoice->id;
            $line_item->each_price = 0;
            $line_item->quantity = $fields->additionnal_guests;
            $line_item->line_price = 0;
            $line_item->line_credits = $fields->additionnal_guests;
            $line_item->save();

            if (!$shindig->payment_status && $fields->additionnal_guests > 0) {
                $shindig->activate();
            }
        }
    }

    /**
     * Get the fields available on the action.
     *
     * @return array
     */
    public function fields()
    {
        return [
            Number::make('Additionnal guests')
        ];
    }
}
