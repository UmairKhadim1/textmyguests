<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ActivateShindigRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'token' => 'required|string',
            'price' => 'required|numeric',
            'event_date' => 'required|date',
            'promotion' => 'nullable|string',
            'totalPrice' => 'required|numeric',
            'promoId' => 'required|numeric',
        ];
    }
}
