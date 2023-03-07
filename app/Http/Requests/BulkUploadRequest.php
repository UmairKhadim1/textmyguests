<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkUploadRequest extends FormRequest
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
            'guests' => 'required|array',
            'guests.*.first_name' => 'string',
            'guests.*.last_name' => 'string',
            'guests.*.phone' => 'required|string|size:12|regex:/^\+1\d{10}$/',
            'groups' => 'array',
            'groups.*.id' => 'required|integer|exists:groups,id',
        ];
    }
}
