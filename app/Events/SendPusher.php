<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\User;

class SendPusher implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $text;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($text)
    {
        $this->text = $text;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        $id = 1;
        if (auth()->check() && auth()->user()) {
            $id = auth()->user()->id;
        }
        // return new Channel('my-channel');

        return new PrivateChannel('my-channel.' . $id);
    }
    // public function broadcastAs()
    // {
    //     return 'my-event';
    // }
}
