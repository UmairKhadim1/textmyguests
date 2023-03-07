<?php

namespace App\Http\Controllers;

use App\Events\PlannerMailchimp;
use App\Events\PlannerMailchimpStatus;
use App\Http\Requests\InviteUserRequest;
use App\Invitation;
use App\Mail\InvitationCreated;
use App\Shindig;
use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Mail;
use Illuminate\Support\Str;

class InvitationController extends Controller
{
    public function invite(InviteUserRequest $request, Shindig $shindig)
    {
        // Get the recipient email
        $email = $request->validated()['email'];

        // $user = User::where('email', $email)->first();

        $owner = $shindig->owners()->where('email', $email)->first();
        // dd($owner);
        if (!$owner) {
            $isPlanner = $request->isPlanner;

            // A (quick?) way to get an unique hash
            do {
                $hash = Str::random(60);
            } while (Invitation::where('hash', $hash)->first());

            $invitation = Invitation::create([
                'shindig_id' => $shindig->id,
                'email' => $email,
                'hash' => $hash,
                'isPlanner' => $isPlanner
            ]);

            // TODO use the real route
            $link = config('app.url') . '/app/dashboard?invite=' . $hash;

            // Send the mail
            Mail::to($email)->send(new InvitationCreated($invitation, $shindig->name, auth()->user(), $link));
            if ($isPlanner) {
                event(new PlannerMailchimp($email));
            }
            return response()->json([
                'status' => 'success',
                'data' => [
                    'id' => $invitation->id,
                    'email' => $email,
                ]
            ]);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => "User already exists"
            ], 404);
        }
    }

    public function removeInvitation(Request $request, Shindig $shindig, $id)
    {
        try {
            $arr_id = explode('_', $id);
            if (count($arr_id) > 1) {
                $shindig->invitations()->where('id', $arr_id[1])->delete();
            } else {
                $shindig->invitations()->where('id', $id)->delete();
            }
            return response()->json([
                'status' => 'success',
                'data' => $id,
            ]);
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
            return response()->json([
                'status' => 'failed',
                'data' => 'invitation could not deleted'
            ]);
        }
    }

    public function accept(Request $request)
    {
        $user = auth()->user();

        if ($request->has('invite')) {
            $hash = $request->input('invite');
            $invitation = Invitation::where([
                ['hash', $hash]
            ])->first();

            if ($invitation && !$invitation->accepted) {
                $shindig = $invitation->shindig;
                $shindig->owners()->attach($user->id);
                $invitation->accepted = true;
                $invitation->save();
                if ($invitation->isPlanner) {
                    $user->isPlanner = true;
                    $user->partner_discount = 20;
                    $user->save();
                    event(new PlannerMailchimpStatus($user));
                }
                return response()->json([
                    'status' => 'success',
                    'data' => [
                        'isPlanner' => $invitation->isPlanner
                    ]
                ]);
            }

            if ($invitation && $invitation->accepted) {
                return response()->json([
                    'status' => 'failed',
                    'message' => "This invitation was already used."
                ], 404);
            }
        }

        return response()->json([
            'status' => 'failed',
            'message' => "An error occured while trying to give you permissions for the event."
        ], 404);
    }
}
