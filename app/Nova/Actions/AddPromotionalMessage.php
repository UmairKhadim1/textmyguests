<?php

namespace App\Nova\Actions;

use Illuminate\Bus\Queueable;
use Laravel\Nova\Actions\Action;
use Illuminate\Support\Collection;
use Laravel\Nova\Fields\ActionFields;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Laravel\Nova\Fields\Boolean;

use App\Shindig;
use App\Invoice;
use App\InvoiceLineItem;
use Carbon\Carbon;

class AddPromotionalMessage extends Action
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
            // Make sure the event is activated
            if (!$shindig->payment_status) {
                return Action::danger('You cannot add a promotional message to an event that is not activated yet.');
            }

            // Make sure the event does not already have a promotional message
            if ($shindig->messages()->where('promotion', 'share50')->exists()) {
                return Action::danger('This event already has a promotional message.');
            }

            // If we want to refund money (50$) to the shindig's owner who activated the event
            if ($fields->refund_money) {
                $invoice = $this->getInvoiceForRefund($shindig);

                if (!$invoice) {
                    return Action::danger('There is no invoice eligible for a refund.');
                }

                // Refund the price of the promotion
                try {
                    $this->refund($invoice, 50);
                } catch (\Exception $e) {

                    return Action::danger(json_encode($e));
                    return Action::danger("Sorry, an error occured while trying to refund invoice $invoice->id");
                }
            }

            // Add the promotional message
            $shindig->addPromotionalMessage();
        }
    }

    public function getInvoiceForRefund(Shindig $shindig)
    {
        // Get all invoices and make sure the user has a balance
        // greater than or equal to the refunded amount
        $amount = 50 * 100; // From $ to cents.
        $balance = 0;
        $invoiceToRefund = null;
        foreach ($shindig->invoices as $invoice) {
            $balance += $invoice->paid_amount;
            if ($invoice->paid_amount > $amount) {
                $invoiceToRefund = $invoice;
            }
        };

        if ($balance < $amount || !$invoiceToRefund) {
            return null;
        }

        return $invoiceToRefund;
    }

    public function refund(Invoice $invoiceToRefund, $amount)
    {
        // Configure stripe
        $stripeKey = env('STRIPE_SECRET');
        \Stripe\Stripe::setApiKey($stripeKey);

        $refund = \Stripe\Refund::create([
            'charge' => $invoiceToRefund->stripe_id,
            'amount' => $amount * 100, // in cents
        ]);

        // Create the invoice for the refund
        $invoice = new Invoice();
        $invoice->user_id = $invoiceToRefund->user_id;
        $invoice->shindig_id = $invoiceToRefund->shindig_id;
        $invoice->stripe_id = $refund->id;
        $invoice->paid_amount = $refund->amount * -1;
        $invoice->paid_at = Carbon::now();
        $invoice->card_type = $invoiceToRefund->card_type;
        $invoice->card_last4 = $invoiceToRefund->card_last4;
        $invoice->save();

        // Create the invoice line item
        $lineItem = new InvoiceLineItem();
        $lineItem->name = "Promotional message discount";
        $lineItem->invoice_id = $invoice->id;
        $lineItem->each_price = 0;
        $lineItem->quantity = 0;
        $lineItem->line_price = $refund->amount * -1;
        $lineItem->line_credits = 0;
        $lineItem->save();

        return $invoice;
    }

    /**
     * Get the fields available on the action.
     *
     * @return array
     */
    public function fields()
    {
        return [
            Boolean::make('Refund money')
        ];
    }
}
