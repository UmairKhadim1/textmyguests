<?php

namespace App\Http\Controllers;

use App\Shindig;
use App\Guest;
use App\Http\Requests\SaveGuestRequest;
use App\Http\Requests\BulkUploadRequest;

class GuestController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Shindig $shindig)
    {
        $shindig->load('guests.groups');
        /* For each guests in the event, transform it after loading its groups
         * and transforming them, then sort by its last name
         */
        $guests = $shindig->guests->sortBy('guest_lastname')->map(function ($guest) {
            return $this->transform($guest);
        })->sortBy('last_name')->values()->all();
        $data = [
            'status' => 'success',
            'data' => [
                'guests' => $guests
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
    public function store(SaveGuestRequest $request, Shindig $shindig)
    {
        return $this->save($request, $shindig, new Guest());
    }

    public function save(SaveGuestRequest $request, Shindig $shindig, Guest $guest, $selfJoin = false)
    {
        $params = $request->validated();

        // If it's a new guest, make sure there is not already
        // a guest with this number for this specific shindig.
        // If yes, return error.
        // If no, set the id for the new guest
        $phone_is_taken = false;
        if (!$guest->id) {
            if ($shindig->getGuest($params['phone'])) {
                $phone_is_taken = true;
            }

            $guest->shindig_id = $shindig->id;
        } else if ($guest->guest_phone !== $params['phone']) {
            // If it's not a new guest, but his phone number was changed,
            // make sure there is not already another guest
            // with this phone number.
            if ($shindig->getGuest($params['phone'])) {
                $phone_is_taken = true;
            }
        }

        if ($phone_is_taken) {
            if ($selfJoin) {
                return null;
            }

            return response()->json([
                'status' => 'failure',
                'message' => 'There is already a guest with this phone number',
                'errors' => [
                    "phone_number" => ["There is already a guest with this phone number."]
                ]
            ], 422);
        }

        $phone = $params['phone'];
        $guest->guest_firstname = $request->get('first_name');
        $guest->guest_lastname = $request->get('last_name');
        $guest->guest_phone = $phone;
        $guest->guest_email = '';
        $guest->save();

        // Get and sync guest's new groups
        $group_ids = array_map(function ($group) {
            return $group['id'];
        }, $params['groups'] ?? []);

        // Find the 'All Guests' group of the shindig and
        // add it to the array if it's not already there.
        $all_guests_group_id = $shindig->getAllGuestGroup()->id;
        if (!in_array($all_guests_group_id, $group_ids)) {
            array_push($group_ids, $all_guests_group_id);
        }

        $guest->groups()->sync($group_ids);

        if ($selfJoin) {
            return $guest;
        }

        $data = [
            'status' => 'success',
            'data' => [
                'guest' => $this->transform($guest)
            ]
        ];

        return response()->json($data);
    }

    /**
     * Saves a new guest that used the public self-join form
     * 
     */
    public function selfJoin(SaveGuestRequest $request, Shindig $shindig)
    {
        if ($shindig->payment_status && $shindig->guestCount() >= $shindig->paidGuestLimit()) {
            return response()->json([
                'status' => 'failure',
                'message' => 'The guest limit has been reached for this event. Please contact your host.'
            ], 422);
        }

        $request->merge(['groups' => [['id' => $shindig->getAllGuestGroup()->id]]]);

        $guest = $this->save($request, $shindig, new Guest(), true);

        // If guest is succesfully saved and the event is activated,
        // send a welcome message to the new guest.
        if ($guest && $shindig->payment_status && $shindig->messagingServiceSid) {
            @\App\sendSMS2(
                $guest->guest_phone,
                "Thank you for joining $shindig->name! You will now receive text messages associated with this event. You can reply to share pictures and messages with the hosts. Reply STOP anytime to cancel.",
                null,
                $shindig->messagingServiceSid
            );
        }

        // Return success if guest is succesfully saved
        if ($guest) {
            $data = [
                'status' => 'success',
                'data' => [
                    'guest' => $this->transform($guest)
                ]
            ];

            return response()->json($data);
        }

        // If null is returned from $this->save, it means there is already
        // a guest with this phone number. Return this error message to client.
        return response()->json([
            'status' => 'failure',
            'message' => 'There is already a guest with this phone number',
            'errors' => [
                "phone_number" => ["There is already a guest with this phone number."]
            ]
        ], 422);
    }

    /**
     * This will take a CSV formated text from the request and either store or update
     * guests in the specified event
     *
     * @return \Illuminate\Http\Response
     */
    public function bulkUpload(BulkUploadRequest $request, Shindig $shindig)
    {
        $params = $request->validated();
        $guests = $params['guests'];
        $added = 0;
        $updated = 0;
        $invalid = 0;

        // Get the users' new groups
        $group_ids = array_map(function ($group) {
            return $group['id'];
        }, $params['groups']);

        // Find the 'All Guests' group of the shindig and
        // add it to the array if it's not already there.
        $all_guests_group_id = $shindig->getAllGuestGroup()->id;
        if (!in_array($all_guests_group_id, $group_ids)) {
            array_push($group_ids, $all_guests_group_id);
        }

        foreach ($guests as $data) {
            // We validate the phone number
            $phone_number = \App\validatePhone($data['phone']); // Returns the phone number or NULL
            if (!$phone_number) {
                $invalid++;
            }

            // We are asuming that phone in the db are saved as +1XXXXXXXXXX
            $guest = $shindig->getGuest($data['phone']);
            if ($guest == null) { // No corresponding guest so saving a new one
                $guest = new Guest();
                $guest->guest_phone = $phone_number;
                $guest->guest_email = '';
                $guest->shindig_id = $shindig->id;
                if ($phone_number) {
                    $added++;
                }
            } else {
                $updated++;
            }

            $guest->guest_firstname = trim($data['first_name']);
            $guest->guest_lastname = trim($data['last_name']);
            $guest->save();
            $guest->groups()->sync($group_ids);
        }
        return response()->json([
            'status' => 'success',
            'data' => [
                'added' => $added,
                'updated' => $updated,
                'invalid' => $invalid
            ],
        ]);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Shindig $shindig, Guest $guest)
    {
        $guest->groups;
        $guest = $this->transform($guest);
        $data = [
            'status' => 'success',
            'data' => [
                'guest' => $guest
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
    public function update(SaveGuestRequest $request, Shindig $shindig, Guest $guest)
    {
        return $this->save($request, $shindig, $guest);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Shindig $shindig, Guest $guest)
    {
        $guest->delete();
        return response()->json(['status' => 'success']);
    }


    public function transform(Guest $guest)
    {
        $groups = $guest->groups->filter(function ($group) {
            return $group->is_all ? null : $group;
        })->map(function ($group) {
            return [
                'id' => $group->id,
                'name' => $group->group_name
            ];
        })->values()->all();
        return [
            'id' => $guest->id,
            'event_id' => $guest->shindig_id,
            'first_name' => $guest->guest_firstname,
            'last_name' => $guest->guest_lastname,
            'phone' => $guest->guest_phone,
            'email' => $guest->guest_email,
            'groups' => $groups,
            'isOptOut' => $guest->guest_opting ? true : false
        ];
    }
    /**
     * This will take a CSV formated text from the request and either store or update
     * guests in the specified event
     *
     * @return \Illuminate\Http\Response
     */
    public function guestsOptout(Shindig $shindig)
    {

        $guests = Guest::where('shindig_id', $shindig->id)->where('guest_opting', 1)->get();
        return response()->json(['guests' =>   $guests]);
    }
}
