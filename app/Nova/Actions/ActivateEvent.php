<?php

namespace App\Nova\Actions;

use Illuminate\Bus\Queueable;
use Laravel\Nova\Actions\Action;
use Illuminate\Support\Collection;
use Laravel\Nova\Fields\ActionFields;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use App\Invoice;
use App\InvoiceLineItem;
use Carbon\Carbon;

class ActivateEvent extends Action
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
            if (!$shindig->payment_status) {
                $user = $shindig->owners()->first();
                // Create the invoice
                $invoice = Invoice::where('shindig_id', $shindig->id)->first();
                if ($invoice) {
                    $invoice->paid_amount = 0;
                    $invoice->paid_at = Carbon::now();
                    $invoice->save();
                } else {
                    $invoice = new Invoice();
                    $invoice->user_id = $user->id;
                    $invoice->shindig_id = $shindig->id;
                    $invoice->paid_amount = 0;
                    $invoice->paid_at = Carbon::now();
                    $invoice->save();
                }


                // Create the invoice line item
                $line_item = new InvoiceLineItem();
                $line_item->name = "Additionnal guests";
                $line_item->invoice_id = $invoice->id;
                $line_item->each_price = 0;
                $line_item->quantity = 500;
                $line_item->line_price = 0;
                $line_item->line_credits = 500;
                $line_item->save();

                $shindig->activatePaymentStatus();
            } else {
                return Action::danger('This event is already activated.');
            }
        }

        return Action::message('The event was successfully activated.');
    }

    /**
     * Get the fields available on the action.
     *
     * @return array
     */
    public function fields()
    {
        return [];
    }
}
