<?php

namespace Tests\Unit\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

use App\User;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_valid_credentials() {
        // Given an existing user
        $user = factory(User::class)->create([
            'password' => bcrypt('password1234')
        ]);
        // When I login using his credentials
        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password1234',
        ]);
        // Then it should succeed
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                 ]);
    }

    public function test_login_invalid_credentials() {
        // Given an existing user
        $user = factory(User::class)->create([
            'password' => bcrypt('password1234')
        ]);
        // When I login with incorrect password
        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email, // This can be found easily no need to test
            'password' => 'password123',
        ]);
        // Then it should fail
        $response->assertStatus(401)
                 ->assertJson([
                     'status' => 'fail',
                 ]);
    }

    public function test_register_valid() {
        // Given correct data
        $data = [
            'name' => 'Hash Skyd',
            'phone'=> '1234567890',
            'email' => 'unknown@none.com',
            'password' => 'password1234',
            'password_confirmation' => 'password1234',
        ];
        // When I register with those
        $response = $this->postJson('/api/auth/register', $data);
        // Then it should succeed
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                 ]);
        $user = User::first();
        $this->assertEquals($data['name'], $user->name);

    }

    public function test_register_missing_data() {
        // Given correct data
        $data = [
            'name' => 'Hash Skyd',
            'phone'=> '1234567890',
        ];
        // When I register with those
        $response = $this->postJson('/api/auth/register', $data);
        // Then it should failed
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_me_as_authentificated_user() {
        $user = factory(User::class)->create();

        $response = $this->actingAs($user)->getJson('/api/auth/me');
        $response->assertStatus(200)
                 ->assertJson([
                     'email' => $user->email,
                 ]);
    }

    public function test_me_as_guest() {
        $user = factory(User::class)->create();

        $response = $this->getJson('/api/auth/me');
        $response->assertStatus(401);
    }
}
