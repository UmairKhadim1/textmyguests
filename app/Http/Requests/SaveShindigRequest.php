<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveShindigRequest extends FormRequest
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
            'name' => 'required',
            'location' => 'required',
            'location.city' => 'required',
            'timezone' => 'required|regex:/^.*\/.*$/',
            'event_date' => 'date',
            'text_to_join' => 'boolean',
            'show_join_button' => 'boolean'
        ];
    }
}
