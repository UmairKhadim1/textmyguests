<?php

namespace App\Policies;

use App\User;
use App\Shindig;
use Illuminate\Auth\Access\HandlesAuthorization;

class ShindigPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }


    public function viewAny(User $user)
    {
        return true;
    }

    public function view(User $user, $item)
    {
        return true;
    }


    public function create(User $user)
    {
        return false;
    }

    public function update(User $user, $item)
    {

        return false;
    }

    public function delete(User $user, $item)
    {
        return false;
    }

    public function restore(User $user, $item)
    {
        return false;
    }

    public function forceDelete(User $user, $item)
    {
        return false;
    }
    public function modify(User $user, Shindig $shindig)
    {
        $count = $shindig->owners()->where('user_id', $user->id)->get()->count();
        return $count > 0;
    }
}
