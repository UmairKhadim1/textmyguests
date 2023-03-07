<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'phone' => 'required|string|size:12|regex:/^\+1\d{10}$/|unique:users,mobilePhone',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'userSource' => 'nullable|string'
        ];
    }
}
