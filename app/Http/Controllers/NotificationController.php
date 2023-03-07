<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Carbon\Carbon;
use App\UserTokens;


class NotificationController extends Controller
{
    public function getNotifications()
    {
        $user = auth()->user();
        $user = User::find(auth()->user()->id);

        $date = Carbon::now()->subDays(7);
        $notfications = $user->notifications()->orderBy('created_at', 'DESC')->where('created_at', '>=', $date)->paginate(15);
        return response()->json($notfications);
        //dd( $notfications);

    }
    public function readNotification($id)
    {
        $user = auth()->user();
        $user = User::find(auth()->user()->id);

        // foreach ($user->unreadNotifications as $notification) {
        //      $notification->markAsRead();
        //   }
        $readNotification = $user->unreadNotifications()->where('id', $id)->update(['read_at' => now()]);
        if ($readNotification) {
            return response()->json("Notification Readed");
        } else {
            return response()->json("Already Notification Readed");
        }
    }
    public function updateUserToken(Request $request)
    {

        $validator = \Validator::make($request->all(), [
            'user_token' => ['required', 'string'],
        ]);
        if ($validator->fails()) {
            return response()->json(
                ['errors' => $validator->errors()->all()],
                400
            );
        } else {
            $user = User::find(auth()->user()->id);
            $user_token = $request->user_token;
            $tokend_user_id = UserTokens::where('user_id', $user->id)->first();
          
            if ($tokend_user_id) {
                
                UserTokens::where('user_id', $user->id)->update(['user_token' => $request->user_token]);
            } 
            else {
                UserTokens::create([
                    'user_id' => $user->id,
                    'user_token' => $user_token
                ]);
            }

            $data = [
                'status' => 'success' 
            ];
            return response()->json($data);
        }
    }
}
