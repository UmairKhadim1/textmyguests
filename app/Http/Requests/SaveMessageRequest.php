<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveMessageRequest extends FormRequest
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
            'contents' => 'string|max:160|nullable',
            'image' => 'string|nullable',
            'thumbnail' => 'string|nullable',
            'ready' => 'required|boolean',
            'immediately' => 'required|boolean',
            'date' => 'required|string|size:10',
            'time' => 'required|string|max:8|min:7',
            'recipients' => 'required|array',
            'recipients.*.id' => 'required|integer|exists:groups,id',
            'testMessage' => 'nullable|boolean',
        ];
    }
}
