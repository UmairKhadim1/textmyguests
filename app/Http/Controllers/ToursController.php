<?php

namespace App\Http\Controllers;

use App\Tour;
use Illuminate\Http\Request;

class ToursController extends Controller
{
    public function checkCompletedTours(Request $request, Tour $tour)
    {

        $tour->user_id = auth()->user()->id;
        $tour->tour_type = $request->tour_type;
        $tour->isCompleted = $request->isCompleted;
        $saveTour = $tour->save();
        if ($saveTour) {
            $data = [
                'status' => 'success',
                'data' => [
                    'message' =>  'your record saved successfully',
                    'data' => $tour
                ]
            ];
            return response()->json($data, 200);
        }
    }
    public function getCompletedTourStatus()
    {

        $tour = Tour::where('user_id', auth()->user()->id)->get();
        if ($tour) {
            $data = [
                'status' => 'success',
                'data' => [
                    'message' =>  'your record fetched successfully',
                    'data' => $tour
                ]
            ];
            return response()->json($data, 200);
        }
    }
}
