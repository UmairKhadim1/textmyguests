<?php

namespace App\Http\Controllers;

use App\Http\Requests\PromoRequest;
use App\Promocode;
use App\PromoDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PromoCodeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth.api');
    }
    public function promo(PromoRequest $request, $id)
    {
        $promocode = Promocode::where('code', $request->promocode)
            ->whereDate('start_date', '<=', Carbon::now()->format('Y-m-d'))
            ->whereDate('end_date', '>=', Carbon::now()->format('Y-m-d'))
            ->first(['id', 'code', 'type', 'price', 'global_limit', 'user_limit', 'used_globally']);

        if (isset($promocode)) {
            //checked if a promocode is reached to its global usage limit
            if ($promocode->global_limit > $promocode->used_globally) {
                $promodetail = PromoDetail::where('user_id', auth()->user()->id)->where('promocode_id', $promocode->id)->get();
                if (!$promodetail->isEmpty()) {

                    //checked if user has reached to its usage limit
                    if (count($promodetail) === $promocode->user_limit) {
                        $data = [
                            'status' => 'error',
                            'message' => 'The limit to use the promocode has been exceeded'
                        ];
                    } else {
                        $data = [
                            'status' => 'success',
                            'data' => $promocode,
                            'message' => 'PromoCode is applied successfully'
                        ];
                    }
                } else {
                    $data = [
                        'status' => 'success',
                        'data' => $promocode,
                        'message' => 'PromoCode is applied successfully'
                    ];
                }
            } else {
                $data = [
                    'status' => 'error',
                    'message' => 'The limit to use the promocode has been exceeded'
                ];
            }
        } else {
            $data = [
                'status' => 'error',
                'message' => 'PromoCode is Invalid or Expired'
            ];
        }

        return response()->json($data);
    }
}
