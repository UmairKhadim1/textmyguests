<?php

namespace Test\Unit\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

use App\User;
use App\Shindig;
use App\Http\Controllers\ShindigController;

class ShindigControllerTest extends TestCase {

    use RefreshDatabase;

    // INDEX
    public function test_index_no_shindigs_for_new_users() {
        // Given a user with no event
        $user = factory(User::class)->create();
        // When I call the endpoint with the user
        $response = $this->actingAs($user)->get('/api/events');
        // Then it should succeed and return no event
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success'
                 ])
                 ->assertJsonCount(0, 'data.events');
    } 

    public function test_index_one_shindig() {
        // Given a user with only one event
        $user = factory(User::class)->create();
        $shindig = factory(Shindig::class)->create();
        $user->shindigs()->attach($shindig->id);
        // When I call the endpoint with the user
        $response = $this->actingAs($user)->get('/api/events');
        // Then it should succeed and return only the event
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'data' => [
                         'events' => [[
                             'name' => $shindig->name,
                         ]],
                     ]
                 ])
                 ->assertJsonCount(1, 'data.events');
    }

    // SHOW
    public function test_show_non_existent_shindig() {
        // Given an user (protected endpoint)
        $user = factory(User::class)->create();
        // When I call the endpoint with the user
        $response = $this->actingAs($user)->get('/api/events/1');
        // Then it should fail 
        $response->assertStatus(404);
    }

    public function test_show_shindig_not_owned_by_user() {
        // Given an user and an event not owned by him
        $user = factory(User::class)->create();
        $shindig = factory(Shindig::class)->create();
        // When I call the endpoint with the user
        $response = $this->actingAs($user)->get('/api/events/'.$shindig->id);
        // Then it should fail 
        $response->assertStatus(403);
    }

    public function test_show_shindig_owned_by_user() {
        // Given a user with an event
        $user = factory(User::class)->create();
        $shindig = factory(Shindig::class)->create();
        $user->shindigs()->attach($shindig->id);
        // When I call the endpoint with the user
        $response = $this->actingAs($user)->get('/api/events/'.$shindig->id);
        // Then it should succeed and return only the event
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'data' => [
                         'event' => [
                             'name' => $shindig->name,
                         ],
                     ]
                 ]);
    }

    // STORE
    public function test_store_event_missing_data() {
        // Given an user (protected endpoint)
        $user = factory(User::class)->create();
        // When I call the endpoint with the user and the data
        $response = $this->actingAs($user)->postJson('/api/events/', []);
        // Then
        $response->assertStatus(422);
    }

    public function test_store_event() {
        // Given an user (protected endpoint)
        $user = factory(User::class)->create();
        // and some event data
        $shindig = factory(Shindig::class)->make();
        // When I call the endpoint with the user and the data
        $response = $this->actingAs($user)->postJson('/api/events', [
            'name' => $shindig->name,
            'location' => $shindig->location,
            'timezone' => $shindig->timezone,
            'start_date' => $shindig->start_date->toDateTimeString(),
            'end_date' => $shindig->end_date->toDateTimeString(),
        ]);
        // Then
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'data' => [
                         'event' => [
                             'name' => $shindig->name,
                         ],
                     ]
                 ]);
    }
    
    // Update
    public function test_update_event_missing_data() {
        // Given an user (protected endpoint)
        $user = factory(User::class)->create();
        // and some event data
        $shindig = factory(Shindig::class)->create();
        $user->shindigs()->attach($shindig->id);
        // When I call the endpoint with the user and the data
        $response = $this->actingAs($user)->putJson('/api/events/'.$shindig->id, []);
        // Then
        $response->assertStatus(422);
    }

    public function test_update_event() {
        // Given an user (protected endpoint)
        $user = factory(User::class)->create();
        // and some event data
        $shindig = factory(Shindig::class)->create();
        $user->shindigs()->attach($shindig->id);
        $name = 'Birthday';
        // When I call the endpoint with the user and the data
        $response = $this->actingAs($user)->putJson('/api/events/'.$shindig->id, [
            'name' => $name,
            'location' => $shindig->location,
            'timezone' => $shindig->timezone,
            'start_date' => $shindig->start_date->toDateTimeString(),
            'end_date' => $shindig->end_date->toDateTimeString(),
        ]);
        // Then
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'data' => [
                         'event' => [
                             'name' => $name,
                             'location' => $shindig->location,
                         ],
                     ]
                 ]);
    }
    
    public function test_update_event_not_owned_by_user() {
        // Given an user (protected endpoint)
        $user = factory(User::class)->create();
        // and some event data
        $shindig = factory(Shindig::class)->create();
        // When I call the endpoint with the user and the data
        $response = $this->actingAs($user)->putJson('/api/events/'.$shindig->id, [
            'name' => $shindig->name,
            'location' => $shindig->location,
            'timezone' => $shindig->timezone,
            'start_date' => $shindig->start_date->toDateTimeString(),
            'end_date' => $shindig->end_date->toDateTimeString(),
        ]);
        // Then
        $response->assertStatus(403);
    }

    // DELETE
    public function test_delete_non_existent_shindig() {
        // Given an user (protected endpoint)
        $user = factory(User::class)->create();
        // When I call the endpoint with the user
        $response = $this->actingAs($user)->delete('/api/events/1');
        // Then it should fail 
        $response->assertStatus(404);
    }

    public function test_delete_shindig_not_owned_by_user() {
        // Given an user and an event not owned by him
        $user = factory(User::class)->create();
        $shindig = factory(Shindig::class)->create();
        // When I call the endpoint with the user
        $response = $this->actingAs($user)->delete('/api/events/'.$shindig->id);
        // Then it should fail 
        $response->assertStatus(403);
    }

    public function test_delete_shindig_owned_by_user() {
        // Given a user with an event
        $user = factory(User::class)->create();
        $shindig = factory(Shindig::class)->create();
        $user->shindigs()->attach($shindig->id);
        // When I call the endpoint with the user
        $response = $this->actingAs($user)->delete('/api/events/'.$shindig->id);
        // Then it should succeed
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                 ]);
    }

    public function test_transform() {
        $shindig = factory(Shindig::class)->make();
        $result = (new ShindigController())->transform($shindig);
        $this->assertEquals($shindig->name, $result['name']);
        $this->assertEquals($shindig->location, $result['location']);
        $this->assertEquals($shindig->timezone, $result['timezone']);
        $this->assertEquals($shindig->start_date->toDateTimeString(), $result['start_date']);
        $this->assertEquals($shindig->end_date->toDateTimeString(), $result['end_date']);
    }   
}
