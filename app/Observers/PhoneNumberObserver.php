<?php

namespace App\Observers;

use App\PhoneNumber;

class PhoneNumberObserver
{
	public function deleted(PhoneNumber $number)
	{
		// upon deletion from the app, release the number at Twilio
        $number->release();
	}
}