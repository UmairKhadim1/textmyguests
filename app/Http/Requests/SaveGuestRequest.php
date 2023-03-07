<?php

namespace App\Http\Requests;

use App\Rules\PhoneNumberValidation;
use Illuminate\Foundation\Http\FormRequest;

class SaveGuestRequest extends FormRequest
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
            'first_name' => ['string'],
            'last_name' => ['string'],
            // 'phone' => 'required|string|size:12|regex:/^\+1\d{10}$/',
            'phone' => ['required', 'string', new PhoneNumberValidation],
            'country' => ['required', 'string'],
            'groups.*.id' => ['required', 'integer', 'exists:groups,id'],
        ];
    }
}
