<?php

namespace App\Http\Controllers;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use App\Notifications\Notifications;
use App\Events\SendPusher;

class PusherNotifications extends Controller
{
   
        public function index()
        {
            $user = User::first();

            $data=[
                'message'=> "Event Has Been created Successfully !",
                'data'=> 'shindig->fresh()'
             ];
            $user->notify(new Notifications( $data) );
            event(new SendPusher($data));
        //Notification::send($user, new TestNotification( $data) );
        }
    
    
}
