<?php

namespace App\Observers;

use App\InvoiceLineItem;

class InvoiceLineItemObserver
{
	public function saving(InvoiceLineItem $line_item)
	{
		// multiply 'each_price' and 'quantity' to get 'line_price'
		if ($line_item->quantity !== 0) {
			$line_item->line_price = $line_item->each_price * $line_item->quantity;
		}

		// TODO:
		// before editing any line items, ensure that the parent invoice is not already paid
		// if so, return 'false' to block the save (I think this will work)
	}

	public function saved(InvoiceLineItem $line_item)
	{
		// when we save a new InvoiceLineItem:
		// 		1) multiply 'each_price' and 'quantity' to get 'line_price'
		// 		2) add 'line_price' of all the parent invoice's line items, update parent's 'total_price'
		// 		3) add 'line_credits' of all the parent invoice's line items, update parent 'total_credits'

		$parent = $line_item->invoice()->get()->first(); // force a fresh query

		$total_price = 0;
		$total_credits = 0;

		foreach ($parent->lineItems as $item) {
			$total_price += $item->line_price;
			$total_credits += $item->line_credits;
		}

		$parent->total_price = $total_price;
		$parent->total_credits = $total_credits;
		$parent->save();
	}

	public function deleted(InvoiceLineItem $line_item)
	{
		// after an InvoiceLineItem is deleted
		//		1) recalculate the parent invoice's 'total_price'
		//		2) recalculate the parent invoice's 'total_credits'

		$parent = $line_item->invoice()->get()->first(); // force a fresh query

		$total_price = 0;
		$total_credits = 0;

		foreach ($parent->lineItems as $item) {
			$total_price += $item->line_price;
			$total_credits += $item->line_credits;
		}

		$parent->total_price = $total_price;
		$parent->total_credits = $total_credits;
		$parent->save();
	}
}
