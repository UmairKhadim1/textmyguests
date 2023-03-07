<?php

namespace App\Nova\Actions;

use Illuminate\Bus\Queueable;
use Laravel\Nova\Actions\Action;
use Illuminate\Support\Collection;
use Laravel\Nova\Fields\ActionFields;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Password;

class PasswordReset extends Action
{
    use InteractsWithQueue, Queueable;

    public $name = "Trigger Password Reset";

    /**
     * Perform the action on the given models.
     *
     * @param  \Laravel\Nova\Fields\ActionFields  $fields
     * @param  \Illuminate\Support\Collection  $models
     * @return mixed
     */
    public function handle(ActionFields $fields, Collection $models)
    {
        foreach ($models as $model) {
            $credentials = ['email' => $model->email];
            $response = Password::sendResetLink($credentials);

            switch ($response) {
                case Password::RESET_LINK_SENT:
                    return Action::message('Password reset email was sent!');
                case Password::INVALID_USER:
                    return Action::danger('Something went wrong and the email was not sent.');
            }
        }
    }

    /**
     * Get the fields available on the action.
     *
     * @return array
     */
    public function fields()
    {
        return [];
    }
}
