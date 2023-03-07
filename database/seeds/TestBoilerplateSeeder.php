<?php

use App\Message;
use App\MessageRecipient;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

use App\User;
use App\Shindig;
use App\Group;
use App\Guest;
use App\GroupMembership;
use App\ShindigOwnership;
use App\InboundSMS;
use App\Media;
use App\Invoice;
use App\InvoiceLineItem;
use App\PhoneNumber;
use Spatie\Permission\Models\Role;

class TestBoilerplateSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Setup a user with 4 different shindigs

        // A user on the free forever plan
        $my_user = new User([
            'name' => 'Bill DAlessandro',
            'email' => 'billda@gmail.com',
            'mobilePhone' => '+17046612244',
            'password' => bcrypt('password1234'),
            'apiKey' => base64_encode(Hash::make('Bill DAlessandro' . 'billda@gmail.com' . time())),
        ]);
        $my_user->save();

        // Create 'Super admin' role and give it to the first user
        Role::create(['name' => 'Super Admin']);
        $my_user->assignRole('Super Admin');

        // A first shindig for the user: empty and not activated
        $empty_shindig = $this->createShindig($my_user, 'Our Wedding');

        // A second shindig with 100 paid users, guests, group, messages and replies
        $paid_shindig_with_replies = $this->createShindig($my_user, '10 years reunion', true);
        $paid_shindig_with_replies->guests()->saveMany(factory(App\Guest::class, 25)->make());
        $other_group = $this->createGroupWithGuests($paid_shindig_with_replies);
        $message = $this->createNewMessage(
            $paid_shindig_with_replies,
            "Let's get the weekend started! Please join us for the Welcome Party at 8:30PM at the Historic Rice Mill (17 Lockwood Drive). See you there!",
            true,
            false
        );
        $message_with_replies = $this->createNewMessage(
            $paid_shindig_with_replies,
            "Welcome to our 10 years reunions! Thanks everyone for coming!",
            false,
            $other_group
        );
        $message = $this->createNewMessage(
            $paid_shindig_with_replies,
            "Awesome!! Thank you everyone.",
            true,
            true
        );
        $this->createTextReplies($paid_shindig_with_replies, $message_with_replies, [
            "Awesome! See you there",
            "Can't wait!!",
            "Do you need us to bring anything?",
            "Wow! This messaging system looks incredible!"
        ]);
        $this->createReplyWithMedias($paid_shindig_with_replies, $message_with_replies, 'Look at this!', [
            ['content_type' => 'image/gif', 's3_filename' => 'test/cantwait.gif']
        ]);
        $this->createReplyWithMedias(
            $paid_shindig_with_replies,
            $message_with_replies,
            'Have a look at these!',
            [
                ['content_type' => 'image/jpeg', 's3_filename' => 'test/people.jpg'],
                ['content_type' => 'image/jpeg', 's3_filename' => 'test/flamingo.jpg'],
                ['content_type' => 'image/jpeg', 's3_filename' => 'test/guy.jpg'],
                ['content_type' => 'image/jpeg', 's3_filename' => 'test/hand.jpg'],
                ['content_type' => 'image/jpeg', 's3_filename' => 'test/girls.jpg'],
                ['content_type' => 'image/gif', 's3_filename' => 'test/incredible.gif'],
            ]
        );
    }

    public function createShindig(User $my_user, $shindig_name, $is_activated = false)
    {
        $my_shindig = Shindig::create([
            'name' => $shindig_name,
            'event_date' => Carbon::now()->addDays(30), // 30 days away
            'city' => 'Charlotte',
            'state' => 'New York',
            'country_code' => 'US',
            'timezone' => 'America/New_York',
            // This is the live Messaging Service Sid for DEV
            'messagingServiceSid' => 'MG341ca34515eb22993a5015841f8e50d0',
            'is_activated' => $is_activated
        ]);

        // Assign shindig ownership to the user.
        ShindigOwnership::create([
            'shindig_id' => $my_shindig->id,
            'user_id' => $my_user->id
        ]);

        // If event is activated, create an invoice
        if ($is_activated) {
            // Create the invoice
            $invoice = Invoice::create([
                'user_id' => $my_user->id,
                'shindig_id' => $my_shindig->id,
                'paid_amount' => 14900,
                'paid_at' => Carbon::now()->addSeconds(120)
            ]);

            // Create the line item for the invoice
            $line_item = InvoiceLineItem::create([
                'name' => 'Event Activation',
                'invoice_id' => $invoice->id,
                'each_price' => 149,
                'quantity' => 100,
                'line_price' => 14900, // 1 credit for each guest
                'line_credits' => 100 // 1 credit for each guest
            ]);

            // Link the DEV MASTER phone number to the activated event
            $phone_number = PhoneNumber::create([
                'shindig_id' => $my_shindig->id,
                'number' => '+12028398693',
                'sid' => 'PNc53a2cad8ad22374887ca1808cafa4e5',
                'country' => "US",
                'dont_release' => true,
                'provisioned_at' => Carbon::now()->subSeconds(1)
            ]);
        }

        return $my_shindig;
    }

    public function createGroupWithGuests(Shindig $shindig)
    {
        $new_group = new Group([
            'shindig_id' => $shindig->id,
            'group_name' => 'Family',
            'group_desc' => 'Members of my family'
        ]);
        $new_group->save();

        // Get the ids of the guests.
        $guest_ids = array_map(function ($guest) {
            return $guest['id'];
        }, $shindig->guests->slice(0, 10)->toArray());
        // Sync the relationship.
        $new_group->guests()->sync($guest_ids);

        return $new_group;
    }

    public function createNewMessage(Shindig $shindig, $contents, $sent, $sent_today, $group = null)
    {
        $new_message = new Message([
            'shindig_id' => $shindig->id,
            'contents' => $contents,
            'ready_to_send' => $sent ? true : false,
            'send_at' => $sent
                ? $sent_today
                ? Carbon::now()->addMinutes(2)
                : Carbon::now()->addDay(-1)
                : Carbon::now()->addDay(10),
            'sent' => $sent
                ? $sent_today
                ? Carbon::now()->addMinutes(2)
                : Carbon::now()->addDay(-1)
                : null
        ]);
        $new_message->save();
        $recipient = $group ? $group->id : $shindig->getAllGuestGroup()->id;
        $new_message->recipients()->sync([$recipient]);

        return $new_message;
    }

    public function createTextReplies(Shindig $shindig, Message $message, $replies)
    {
        $new_replies = [];
        foreach ($replies as $i => $reply) {
            $message_sid = 'SM' . str_random(32);
            $new_replies[] = new InboundSMS([
                'shindig_id' => $shindig->id,
                'received_at' => Carbon::parse($message->sent_at)->addMinutes($i),
                'messageSid' => $message_sid,
                'fromPhone' => $shindig->guests[$i]->guest_phone,
                'toPhone' => '+12028398693',
                'body' => $reply,
                'numMedia' => 0
            ]);
        }

        $shindig->inboundSMS()->saveMany($new_replies);
    }

    public function createReplyWithMedias(Shindig $shindig, Message $message, $reply, $medias)
    {
        $message_sid = 'SM' . str_random(32);
        $new_reply = new InboundSMS([
            'shindig_id' => $shindig->id,
            'received_at' => Carbon::parse($message->sent_at)->addMinutes(rand(0, 4)),
            'messageSid' => $message_sid,
            'fromPhone' => $shindig->guests[0]->guest_phone,
            'toPhone' => '+12028398693',
            'body' => $reply,
            'numMedia' => count($medias)
        ]);

        foreach ($medias as $key => $media) {
            $new_reply['MediaUrl' . $key] = $media['s3_filename'];
            $m = new Media([
                'date_created' => Carbon::parse('2018-03-04 19:24:07'),
                'media_sid' => 'ME' . str_random(32),
                'parent_sid' => $message_sid,
                'shindig_id' => $shindig->id,
                'content_type' => $media['content_type'],
                's3_filename' => $media['s3_filename']
            ]);
            $m->save();
        }

        $shindig->inboundSMS()->save($new_reply);
    }
}
