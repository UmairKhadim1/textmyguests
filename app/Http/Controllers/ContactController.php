<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ContactUsRequest;
use App\Mail\ContactUs;
use Mail;

class ContactController extends Controller
{
    public function contactUs(ContactUsRequest $request) {
        $params = $request->validated();

        Mail::to("help@textmyguests.com")->queue(
            new ContactUs(
                $params["subject"],
                $params["message"],
                auth()->user()
            )
        );

        return response()->json(['status' => 'success']);
    }
}
