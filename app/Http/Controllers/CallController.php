<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CallController extends Controller
{
    public function incoming(Request $request)
    {
        // handle an incoming Call from Twilio
    }

    public function callback(Request $request)
    {
        // process a call callback from Twilio
    }
}
