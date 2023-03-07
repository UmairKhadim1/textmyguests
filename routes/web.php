<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


// Twilio SMS and call handing routes

use App\Events\MyEvent;
use App\Message;
use App\Notification;
use App\PhoneNumber;
use App\Shindig;
use App\ShindigOwnership;
use App\User;
use App\Events\SendPusher;
use Illuminate\Support\Carbon;
use App\UserTokens;
use App\Notifications\AndroidNotifications;
use App\Mail\EventExpireToday;
use App\Mail\EventSummary;
use App\Mail\EventExpireAfterThreeDays;
use App\MessagingService;



Route::get('csv_file/export', [App\Http\Controllers\CSVDownloader::class, 'csv_export'])->name('export');

// use Newsletter;
// Route::get('/send-notification', [App\Http\Controllers\PusherNotifications::class, 'index']);

// Route::get('/counter', function () {
//     return view('counter');
// });
// Route::get('/sender',function(){
//     return view('sender');
// });
// Route::get('test', function () {
//     event(new SendPusher('asdfsdf'));
//     return "Event has been sent!";
// });
Route::post('/handleInboundSMS', 'SMSController@inbound')->name('handleSMS');
Route::post('/handleSMSCallback', 'SMSController@callback')->name('SMScallback');
Route::post('/handleIncomingCall', 'CallController@incoming')->name('handleCall');
Route::post('/handleCallCallback', 'CallController@callback')->name('Callcallback');

// PDF invoice routes
Route::resource('/invoices', 'InvoiceController');

Route::view('/', 'landing')
    ->name('landing');
Route::view('/features', 'features')
    ->name('features');
Route::view('/real-events', 'realevents')
    ->name('realevents');
Route::view('/partnerships', 'partnerships')
    ->name('partnerships');
Route::view('/pricing', 'pricing')
    ->name('pricing');
Route::view('/pricing-social', 'social-pricing')
    ->name('pricing');
Route::view('/privacy', 'privacy')
    ->name('privacy');

Route::view('/app/{path?}', 'index')
    ->where('path', '.*')
    ->name('react');

// Routes of the short domain tmg.link
Route::group(['domain' => env('APP_SHORT_URL', 'tmg.link')], function () {
    Route::get('/{shindig}/join', function (App\Shindig $shindig) {
        return view('selfJoin', ['shindig' => $shindig]);
    });

    Route::get('/{shindig}/r/{reply}/{media?}', function (App\Shindig $shindig, App\InboundSMS $reply, App\Media $media) {
        return view('isolatedReply', [
            'shindig' => $shindig,
            'reply' => App\Http\Controllers\SMSController::transformForReplyStream($reply),
            'mediaCount' => $reply->media ? count($reply->media) : 0,
            'media' => $media && $media->id
                ? (strpos($media->content_type, 'image') !== false ? $media->getS3URL() : null)
                : (count($reply->media) ? $reply->media[0]->getS3URL() : null)
        ]);
    });

    Route::get('/{shindig}/m/{message}', function (App\Shindig $shindig, App\Message $message) {
        return view('isolatedReply', [
            'shindig' => $shindig,
            'reply' => App\Http\Controllers\MessageController::transformForReplyStream($message),
            'mediaCount' => $message->media_url ? 1 : 0,
            'media' => $message->media_url ? $message->media_url : null
        ]);
    });

    Route::get('/{shindig}', function (App\Shindig $shindig) {
        return view('replyStream', ['shindig' => $shindig]);
    })->name('replyStream');
});


Route::get('/getEvents', 'ShindigController@returnEvent');
Route::get('/reEvent', function () {
    $event = Shindig::find(41);
    dd($event->owners()->get());
});
// Route::get('/test' . function () {
//     $shindig = Shindig::find(23);
//     return $shindig->event_date;
// });
// Route::get('test', function () {
//     try {
//         $users = User::all();
//         //Generate New Filename
//         $filename = Carbon::now()->toDateTimeString();
//         $file = fopen(public_path($filename), 'w');
//         $columns = array(
//             'email', 'response'
//         );
//         fputcsv($file, $columns);

//         foreach ($users as $user) {
//             $user->events = $user->shindigs()->orderBy('shindig_id', 'desc')->limit(3)->get();
//             $array = array("", "", "");
//             $active = array("Inactive", "Inactive", "Inactive");
//             $status = 'Inactive';
//             if ($user->events->isEmpty()) {
//                 $array[0] = "";
//                 $array[1] = "";
//                 $array[2] = "";
//             } else {
//                 if (count($user->events) < 1) {
//                     $array[0] = "";
//                     $array[1] = "";
//                     $array[2] = "";
//                 } else if (count($user->events) < 2) {
//                     $array[0] = $user->events[0]->event_date->format('Y-m-d');
//                     $array[1] = "";
//                     $array[2] = "";
//                     if ($user->events[0]->is_activated == 1) {
//                         $active[0] = 'Active';
//                     }
//                 } else if (count($user->events) < 3) {
//                     $array[0] = $user->events[0]->event_date->format('Y-m-d');
//                     $array[1] = $user->events[1]->event_date->format('Y-m-d');
//                     $array[2] = "";
//                     if ($user->events[0]->is_activated == 1) {
//                         $active[0] = 'Active';
//                     }
//                     if ($user->events[1]->is_activated == 1) {
//                         $active[1] = 'Active';
//                     }
//                 } else {
//                     $array[0] = $user->events[0]->event_date->format('Y-m-d');
//                     $array[1] = $user->events[1]->event_date->format('Y-m-d');
//                     $array[2] = $user->events[2]->event_date->format('Y-m-d');
//                     if ($user->events[0]->is_activated == 1) {
//                         $active[0] = 'Active';
//                     }
//                     if ($user->events[1]->is_activated == 1) {
//                         $active[1] = 'Active';
//                     }
//                     if ($user->events[2]->is_activated == 1) {
//                         $active[2] = 'Active';
//                     }
//                 }
//             }
//             $user->evnt = $array;


//             if (Newsletter::isSubscribed($user->email)) {
//                 if ($result = Newsletter::subscribeOrUpdate($user->email, ['FNAME' => $user->first_name, 'LNAME' => $user->last_name, 'PHONE' => $user->mobilePhone, 'EVENTDATE1' => $user->evnt[0], 'EVENTDATE2' => $user->evnt[1], 'EVENTDATE3' => $user->evnt[2], 'EV_ACTIVE1' => $active[0], 'EV_ACTIVE2' => $active[1], 'EV_ACTIVE3' => $active[2]])) {
//                     $data = array(
//                         $user->email, 'true'
//                     );
//                     fputcsv($file, $data);
//                     // $this->addToFile($file, $user->email, 'true');
//                 } else {
//                     $data = array(
//                         $user->email, 'false'
//                     );
//                     fputcsv($file, $data);
//                     // $this->addToFile($file, $user->email, 'false');
//                 }
//             } else {
//                 if ($result = Newsletter::subscribe($user->email, ['FNAME' => $user->first_name, 'LNAME' => $user->last_name, 'PHONE' => $user->mobilePhone, 'EVENTDATE1' => $user->evnt[0], 'EVENTDATE2' => $user->evnt[1], 'EVENTDATE3' => $user->evnt[2], 'EV_ACTIVE1' => $active[0], 'EV_ACTIVE2' => $active[1], 'EV_ACTIVE3' => $active[2]])) {
//                     $data = array(
//                         $user->email, 'true'
//                     );
//                     fputcsv($file, $data);
//                     // $this->addToFile($file, $user->email, 'true');
//                 } else {
//                     $data = array(
//                         $user->email, 'false'
//                     );
//                     fputcsv($file, $data);
//                     // $this->addToFile($file, $user->email, 'false');
//                 }
//             }

//             // usleep(150000);
//         }
//         fclose($file);
//         return $users;
//     } catch (Exception $ex) {
//         // return dd($ex);
//     }
// });


//     return $shindigs;
// // });

// Route::get('/test', function () {
//     $user = User::find(9);
//     event(new MyEvent($user));
// });
// Route::get('/test', function () {
//     $data = [
//         'url'=>'https://dev.textmyguests.com/app/dashboard/messages'
//     ];

//     OneSignal::sendNotificationToUser(
//         "asdasd Messagecvassadc", 
//         "9a392942-2423-49b2-a239-05152207ffab",
//         $url = null, 
//         $data,
//         $buttons = null, 
//         $schedule = null
//     );
// });

// // Route::view('pusher', 'Pusher');
// Route::get('pusher', function () {
//     $user = User::find(9);
//     return view('Pusher')->with('user', $user);
// });

Route::get('/testMsg', function () {
    $msg = null;
    $messagingservices = MessagingService::all();
    foreach ($messagingservices as $messagingservice) {
        if ($messagingservice->usedService < $messagingservice->totalLimit) {
            $msg = $messagingservice;
            break;
        }
    }
    dd($msg);
});
