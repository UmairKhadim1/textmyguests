<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\SaveGroupRequest;
use App\Shindig;
use App\Group;
use App\User;
use App\Notifications\Notifications;
use OneSignal;
use App\UserTokens;
use Exception;
use Illuminate\Support\Facades\Log;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, Shindig $shindig)
    {
        /* Transform each groups, then sort them by name while retaining
         * the special group All Guests as first item
         */
        $groups = $shindig->groups()->get()->map(function ($group) {
            return $this->transform($group);
        })->sortBy('name')->sort(function ($a, $b) {
            return !$a['is_all']; // All guest is always first
        })->values()->all();
        // making the response
        $data = [
            'status' => 'success',
            'data' => [
                'groups' => $groups
            ]
        ];
        return response()->json($data);
    }

    public function save(SaveGroupRequest $request, Shindig $shindig, Group $group)
    {
        $params = $request->validated();
        if (!$group->id) {  // set the event only if if new
            $group->shindig_id = $shindig->id;
        }
        $group->group_name = $params['name'];
        $group->save();

        //Pushing web notification on group creation 
        $user = auth()->user();
        $user = User::find(auth()->user()->id);
        $notification_data = [
            'message' => 'Your group "' . $group->group_name . '" has been created successfully!',
            'data' => $group->fresh(),
            'notify_type' => "group_created"
        ];
        $user->notify(new Notifications($notification_data));
        try {
            $users_token = UserTokens::select('user_token')->where('user_id', $user->id)->value('user_token');
            if ($users_token) {
                $data = [
                    'url' => env('APP_URL') . '/app/dashboard/groups'
                ];
                OneSignal::sendNotificationToUser(
                    'Your Group "' . $group->group_name . '" has been Created',
                    $users_token,
                    $url = null,
                    $data,
                    $buttons = null,
                    $schedule = null
                );
            }
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
        }
        // Get the user new groups
        $guest_ids = array_map(function ($guest) {
            return $guest['id'];
        }, $params['guests']);
        // sync the relation ships
        $group->guests()->sync($guest_ids);
        $data = [
            'status' => 'success',
            'data' => [
                'group' => $this->transform($group)
            ]
        ];
        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SaveGroupRequest $request, Shindig $shindig)
    {
        return $this->save($request, $shindig, new Group());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Shindig $shindig, Group $group)
    {
        $group = $this->transform($group);
        $data = [
            'status' => 'success',
            'data' => [
                'group' => $group
            ]
        ];
        return response()->json($data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(SaveGroupRequest $request, Shindig $shindig, Group $group)
    {
        return $this->save($request, $shindig, $group);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Shindig $shindig, Group $group)
    {
        $group->delete();
        return response()->json(['status' => 'success']);
    }

    public function transform(Group $group)
    {
        $guests = $group->guests->map(function ($guest) {
            return [
                'id' => $guest->id,
                'first_name' => $guest->guest_firstname,
                'last_name' => $guest->guest_lastname
            ];
        })->values()->all();
        return [
            'id' => $group->id,
            'event_id' => $group->shindig_id,
            'name' => $group->group_name,
            'guests' => $guests,
            'guest_count' => $group->guests->count(),
            'is_all' => $group->is_all == 1 ? true : false,
            'is_testGroup' => $group->is_testGroup == 1 ? true : false,
        ];
    }
}
