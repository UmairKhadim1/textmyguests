<?php

namespace Tests\Unit\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

use Event;

use App\User;
use App\Shindig;
use App\Guest;

class GuestControllerTest extends TestCase
{
    use RefreshDatabase;
    
    protected $user;
    protected $shindig;
    protected $guest;

    protected function setUp() {
        parent::setUp();
        $this->user = factory(User::class)->create();
        $this->shindig = factory(Shindig::class)->create();
        $this->user->shindigs()->attach($this->shindig->id);
        $this->guest = factory(Guest::class)->make();
    }

    public function test_index_no_guests()
    {
        $this->guest->shindig_id = $this->shindig->id + 1;
        $this->guest->save();
        $response = $this->actingAs($this->user)
                         ->getJson('/api/events/'.$this->shindig->id.'/guests');
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                 ])
                 ->assertJsonCount(0, 'data.guests');
    }

    public function test_bulk_upload_success() {
        Event::fake();
        $this->guest->shindig_id = $this->shindig->id;
        $this->guest->guest_phone = preg_replace('/\D+/', '', $this->guest->guest_phone);
        $this->guest->save();
        $csv = 'Hash, Skyd, 1234567890\n'.
            'Bill, Dallesandro, '.$this->guest->guest_phone;
        $response = $this->actingAs($this->user)
                         ->postJson('/api/events/'.$this->shindig->id.'/guests/bulk-upload',
                             [
                                 'guests' => $csv,
                             ]);
        $response->assertStatus(200)
            ->assertExactJson([
                'status' => 'success',
                'data' => [
                    'added' => 1,
                    'updated' => 1,
                ],
            ]);
        $this->assertEquals(Guest::all()->count(), 2);
    }
    

}
