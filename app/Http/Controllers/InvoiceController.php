<?php

namespace App\Http\Controllers;

use App\Http\Requests\RefundInfoRequest;
use Illuminate\Http\Request;
use App\Invoice;
use App\InvoiceLineItem;
use App\Shindig;
use Carbon\Carbon;
use PDF;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $invoices = auth()
            ->user()
            ->invoices()
            ->whereNotNull('paid_amount')
            ->get()
            ->map(function ($invoice) {
                return $this->transform($invoice);
            });

        $data = [
            'status' => 'success',
            'data' => $invoices
        ];

        return response()->json($data);
    }

    public function show(Invoice $invoice)
    {
        // Prepare data for the invoice
        $data  = [
            'invoice_id' => $invoice->id,
            'event_name' => $invoice->shindig->name,
            'client_name' => $invoice->user->first_name . ' ' . $invoice->user->last_name,
            'client_email' => $invoice->user->email,
            'total_price' => number_format($invoice->total_price / 100, 2),
            'paid_amount' => number_format($invoice->paid_amount / 100, 2),
            'paid_at' => Carbon::parse($invoice->paid_at)->format('Y-m-d'),
            'card_type' => $invoice->card_type,
            'card_last4' => $invoice->card_last4,
            'created_at' => $invoice->created_at->toDateString(),
            'line_items' => []
        ];

        foreach ($invoice->lineItems as $line_item) {
            $data['line_items'][] = [
                'name' => $line_item->name,
                'price' => number_format($line_item->line_price / 100, 2), // from cents to dollars
            ];
        }

        // Return a pdf using a HTML view
        $pdf = PDF::loadView('invoice.index', $data);

        return $pdf->stream();
        return view('invoice.index', $data);
    }

    public function transform(Invoice $invoice)
    {
        $description = InvoiceLineItem::where('invoice_id', $invoice->id)->first();
        return [
            'id' => $invoice->id,
            'slug' => $invoice->slug(),
            'total_price' => number_format($invoice->total_price / 100, 2),
            'paid_amount' => number_format($invoice->paid_amount / 100, 2),
            'total_credits' => $invoice->total_credits,
            'paid_at' => Carbon::parse($invoice->paid_at)->format('Y-m-d'),
            'description' => $description ? $description->name : 'Event Activation',
            'shindig' => [
                'id' => $invoice->shindig->slug(),
                'name' => $invoice->shindig->name
            ],
            'card_type' => $invoice->card_type,
            'card_last4' => $invoice->card_last4
        ];
    }

    /**
     * Returns the card info for a refund
     */
    public function getInvoiceForRefund(RefundInfoRequest $request, Shindig $shindig)
    {
        $params = $request->validated();
        $user = auth()->user();

        // Get all invoices and make sure the user has a balance
        // greater than or equal to the refunded amount
        $amount = $params['amount'] * 100; // From $ to cents.
        $balance = 0;
        $invoice_to_refund = null;
        foreach ($shindig->invoices as $invoice) {
            $balance += $invoice->paid_amount;
            if (
                $invoice->paid_amount > $amount &&
                $invoice->user_id === $user->id
            ) {
                $invoice_to_refund = $this->transform($invoice);
            }
        };

        if ($balance < $amount || !$invoice_to_refund) {
            return response()->json([
                'message' => 'Your account is not eligible for a refund of this amount.',
                'invoices' => $shindig->invoices,
                'balance' => $balance,
                'amount' => $amount
            ], 500);
        }

        $data = [
            'status' => 'success',
            'data' => [
                'invoice' => $invoice_to_refund
            ]
        ];
        return response()->json($data);
    }
}
