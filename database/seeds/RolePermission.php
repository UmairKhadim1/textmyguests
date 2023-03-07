<?php

use App\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermission extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $role = Role::create(['name' => 'user', 'guard_name' => 'api']);
        // $permission = Permission::create(['name' => 'user', 'guard_name' => 'api']);
        $user = User::create([
            'first_name' => 'Bill',
            'last_name' => 'DAlessandro',
            'email' => 'billda@gmail.com',
            'mobilePhone' => '+17046612244',
            'password' => bcrypt('password1234')
        ]);
    }
}
