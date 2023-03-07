<?php

namespace App\Rules;

use Exception;
use Illuminate\Contracts\Validation\Rule;

class PhoneNumberValidation implements Rule
{
    public $num;
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $phone = '';
        $phoneUtil = \libphonenumber\PhoneNumberUtil::getInstance();
        try {
            $phone = $phoneUtil->parse($value);
            // $this->num = $phone;
        } catch (Exception $e) {
            return false;
        }
        $this->num = $phone;
        if ($phoneUtil->isValidNumber($phone)) {
            return true;
        } else {
            return false;
        }
        // $num = $phone;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'You entered an invalid phone number' . $this->num;
    }
}
