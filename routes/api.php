<?php

use Illuminate\Http\Request;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Broadcast::routes(['middleware' => 'auth:api']);
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'prefix' => 'auth',
], function ($router) {
    Route::post('verify', 'AuthController@verify')->name('verify');
    // Route::post('sendOTP', 'AuthController@sendOTP')->name('sendOTP');
    Route::post('login', 'AuthController@login')->name('login');
    Route::post('register', 'AuthController@register')->name('register');
    Route::post('businesses-discount', 'AuthController@businessesDiscount')->name('businesses-discount');
    Route::post('logout', 'AuthController@logout');
    Route::get('refresh', 'AuthController@refresh');
    Route::get('me', 'AuthController@me');
    Route::post('update-basic-info', 'AuthController@updateBasicInfo');
    Route::post('update-password', 'AuthController@updatePassword');
    Route::post('send-reset-link', 'AuthController@forgotPassword');
    Route::post('recover-password', 'AuthController@resetForgottenPassword');
});

Route::post('auth/sendOTP', 'AuthController@sendOTP')->name('sendOTP');

// Route for public reply stream
Route::group([
    'domain' => env('APP_SHORT_URL', 'tmg.link'),
    'prefix' => 'events/{event}',
], function () {
    Route::get('public-reply-stream', 'ShindigController@publicReplyStream');
});

// Public API endpoints to get public informations of some resources
Route::get('events/{shindig}/public', 'ShindigController@showPublic');
Route::get('messages/{message}/public', 'MessageController@showPublic');
Route::get('replies/{sms}/public', 'SMSController@showPublic');

// Public API endpoint to self join an event
Route::post('events/{shindig}/guests/self', 'GuestController@selfJoin');

Route::group([
    'middleware' => 'auth.api'
], function () {
    Route::post('process-invitation', 'InvitationController@accept')->name('accept-invite');
    Route::post('contact-us', 'ContactController@contactUs')->name('contact-us');
    Route::resource('/invoices', 'InvoiceController');
    Route::post('impersonate', 'AuthController@impersonate');
    Route::get('leave-impersonation', 'AuthController@leaveImpersonation');
    // Route::get('web-notifications', 'NotificationController@getNotification');
    // Route::get('/web-notifications/{id}', 'NotificationController@readNotification');
    Route::resources([
        'events' => 'ShindigController',
    ]);
    Route::group([
        'prefix' => 'events/{event}',
        'middleware' => ['can:modify,event']
    ], function () {
        Route::resources([
            'messages' => 'MessageController',
            'guests' => 'GuestController',
            'groups' => 'GroupController',
        ]);
        Route::get('reply-stream', 'ShindigController@replyStream');
        Route::post('toggle-stream-public', 'ShindigController@toggleStreamPublic');
        Route::post('guest-bulk-upload', 'GuestController@bulkUpload');
        Route::post('messages/{message}/enable', 'MessageController@toggleReady');
        Route::get('dashboard', 'ShindigController@dashboard');
        Route::get('hide-onboarding', 'ShindigController@hideOnboarding');
        // Owners
        Route::get('owners', 'ShindigController@owners');
        Route::delete('owner/{id}', 'ShindigController@removeOwner');
        // Invitation
        Route::post('invite', 'InvitationController@invite');
        Route::delete('invite/{id}', 'InvitationController@removeInvitation');
        // Payment
        Route::post('activate-event', 'ShindigController@activateShindig');
        Route::post('opt-out', 'ShindigController@optOutPromotion');
        Route::post('opt-in', 'ShindigController@optInPromotion');
        Route::post('refund-get-invoice', 'InvoiceController@getInvoiceForRefund');
        // Hide messages and replies
        Route::post('toggle-hidden-reply', 'MessageController@toggleHiddenFromReplyStream');
        // Upload an image to send with a message
        Route::post('image-upload', 'MessageController@uploadImage');
    });
});


Route::get('replies', 'ShindigController@replies');

Route::post('event/{id}/promo', 'PromoCodeController@promo');

Route::get('event/{id}/downloadImages', 'ImageController@downloadImages');
Route::get('event/{id}/emailImages', 'ImageController@emailImages');

Route::get('/event/{id}/deleteFile', 'ImageController@deleteFile');
//Route::middleware('auth:api')->post('/handleInboundSMS', 'API\SMSController@inbound');
//Route::middleware('auth:api')->post('/handleSMSCallback', 'API\SMSController@callback');
//Route::middleware('auth:api')->post('/handleIncomingCall', 'API\CallController@incoming');

Route::middleware('auth:api')->get('/web-notifications', 'NotificationController@getNotifications');
Route::middleware('auth:api')->get('/web-notifications/{id}', 'NotificationController@readNotification');
Route::middleware('auth:api')->post('/user-token', 'NotificationController@updateUserToken');

//guest opt out api 
Route::middleware('auth:api')->get('/guests-opt-out/{event}', 'GuestController@guestsOptout');

//chat message api,s
Route::middleware('auth:api')->post('/chat-message/{event}', 'MessageController@sendChatMessage');
Route::middleware('auth:api')->get('/chat-message/{event}', 'MessageController@getChatMessages');
Route::middleware('auth:api')->get('/allRecipents/{event}', 'MessageController@getAllRecipientsWithLastMessage');
Route::middleware('auth:api')->get('/guest-messages/{event}', 'MessageController@getUserAllMessages');
//tours api
Route::middleware('auth:api')->post('/tour', 'ToursController@checkCompletedTours');
Route::middleware('auth:api')->get('/tour', 'ToursController@getCompletedTourStatus');
