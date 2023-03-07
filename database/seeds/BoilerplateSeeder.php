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

class BoilerplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // setup a user, a shindig, three groups, and five guests

        // a user on the free forever plan
        $my_user = new User([
            'name' => 'Bill DAlessandro',
            'email' => 'billda@gmail.com',
            'mobilePhone' => '+17046612244',
            'password' => bcrypt('password1234'),
            'apiKey' => base64_encode(Hash::make('Bill DAlessandro' . 'billda@gmail.com' . time())),
        ]);
        $my_user->save();

        // a shindig for the user
        $my_shindig = new Shindig([
            'name' => 'Our Wedding',
            'start_date' => Carbon::now()->addDays(30), // 30 days away
            'end_date' => Carbon::now()->addDays(40), // 40 days away
            'city' => 'Charlotte',
            'state' => 'New York',
            'country_code' => 'US',
            'timezone' => 'America/New_York',
            'messagingServiceSid' => 'MG28310c22bea3fb0ada7d01667dbb2476',
            //'hash' => Hashids::encode('Our Wedding'.time()),
        ]);
        $my_shindig->save();

        // assign shindig ownership to the user
        ShindigOwnership::create(['shindig_id' => $my_shindig->id, 'user_id' => $my_user->id]);

        /*
 *        // two groups for the shindig (The all group is automatically created)
 *        $group_one = $shindig->getAllGuestGroup();
 *
 *        $group_two = new Group([
 *            'shindig_id' => $my_shindig->id,
 *            'group_name' => 'Groomsmen',
 *            'group_desc' => 'All of the horses and all the groomsmen.',
 *            'is_all' => 0
 *        ]);
 *        $group_two->save();
 *
 *        $group_three = new Group([
 *            'shindig_id' => $my_shindig->id,
 *            'group_name' => 'Bridesmaids',
 *            'group_desc' => 'The merry maids.',
 *            'is_all' => 0
 *        ]);
 *        $group_three->save();
 *
 *        // these guests are in group_two
 *        $guest_one = new Guest([
 *            'shindig_id' => $my_shindig->id,
 *            'guest_firstname' => 'John',
 *            'guest_lastname' => 'Doe',
 *            'guest_phone' => '+17046612244',
 *            'guest_email' => 'bill@billda.com',
 *            //'guest_hash' => Hashids::encode('John'.'Doe'.'+17046612244'.'bill@billda.com'.time()),
 *        ]);
 *        $guest_one->save();
 *        GroupMembership::create(['group_id' => $group_two->id, 'guest_id' => $guest_one->id]); // put this guest in group_two
 *
 *        $guest_two = new Guest([
 *            'shindig_id' => $my_shindig->id,
 *            'guest_firstname' => 'Brian',
 *            'guest_lastname' => 'Black',
 *            'guest_phone' => '', //has no phone
 *            'guest_email' => 'bill@elementsbrands.com',
 *            //'guest_hash' => Hashids::encode('Brian'.'Black'.''.'bill@elementsbrands.com'.time()),
 *        ]);
 *        $guest_two->save();
 *        GroupMembership::create(['group_id' => $group_two->id, 'guest_id' => $guest_two->id]); // put this guest in group_two
 *
 *        // these guests are in group_three
 *        $guest_three = new Guest([
 *            'shindig_id' => $my_shindig->id,
 *            'guest_firstname' => 'Jane',
 *            'guest_lastname' => 'Doe',
 *            'guest_phone' => '+17248589809',
 *            'guest_email' => 'ned5010@gmail.com',
 *            //'guest_hash' => Hashids::encode('Jane'.'Doe'.'+17248589809'.'ned5010@gmail.com'.time()),
 *        ]);
 *        $guest_three->save();
 *        GroupMembership::create(['group_id' => $group_three->id, 'guest_id' => $guest_three->id]); // put this guest in group_three
 *
 *        $guest_four = new Guest([
 *            'shindig_id' => $my_shindig->id,
 *            'guest_firstname' => 'Ginny',
 *            'guest_lastname' => 'Green',
 *            'guest_phone' => '+17042316094',
 *            'guest_email' => 'natalie@mannhummel.com',
 *            //'guest_hash' => Hashids::encode('Ginny'.'Green'.''.'bill@coralsafe.com'.time()),
 *        ]);
 *        $guest_four->save();
 *        GroupMembership::create(['group_id' => $group_three->id, 'guest_id' => $guest_four->id]); // put this guest in group_three
 *
 *        // one more guest, not in any groups
 *        $guest_five = new Guest([
 *            'shindig_id' => $my_shindig->id,
 *            'guest_firstname' => 'Molly',
 *            'guest_lastname' => 'Mother',
 *            'guest_phone' => '+17043653153', //landline
 *            'guest_email' => 'bill@nurturemybody.com',
 *            //'guest_hash' => Hashids::encode('Molly'.'Mother'.''.'bill@nurturemybody.com'.time()),
 *        ]);
 *        $guest_five->save();
 *
 *
 *        // Create some messages
 *        $message_one = new Message([
 *            'shindig_id' => $my_shindig->id,
 *            'contents' => 'Welcome to our wedding weekend! Thanks everyone for coming!',
 *            'ready_to_send' => true,
 *            'send_at' => Carbon::now()->addDay(-1),
 *            'sent' => Carbon::now()->addDay(-1)
 *        ]);
 *        $message_one->save();
 *        MessageRecipient::create(['message_id' => $message_one->id, 'group_id' => $group_one->id]);
 *
 *
 *        $message_two = new Message([
 *            'shindig_id' => $my_shindig->id,
 *            'contents' => 'Buses to the ceremony leave in 30 minutes from the Mariott. Please be downstairs on time!',
 *            'ready_to_send' => true,
 *            'send_at' => Carbon::now()->addDay(1),
 *            'sent' => null
 *        ]);
 *        $message_two->save();
 *        MessageRecipient::create(['message_id' => $message_two->id, 'group_id' => $group_one->id]);
 *
 *        $message_three = new Message([
 *            'shindig_id' => $my_shindig->id,
 *            'contents' => 'The ceremony is beginning in 15 minutes at Little Church on the Lane',
 *            'ready_to_send' => false,
 *            'send_at' => Carbon::now()->addDay(-1)->addMinutes(15),
 *            'sent' => null
 *        ]);
 *        $message_three->save();
 *        MessageRecipient::create(['message_id' => $message_three->id, 'group_id' => $group_one->id]);
 *
 *
 *        $message_four = new Message([
 *            'shindig_id' => $my_shindig->id,
 *            'contents' => 'Bridesmaids and Groomsmen, please stay behind at the church for pictures',
 *            'ready_to_send' => true,
 *            'send_at' => Carbon::now()->addDay(-1)->addHour(1)->addMinutes(15),
 *            'sent' => null
 *        ]);
 *        $message_four->save();
 *        MessageRecipient::create(['message_id' => $message_four->id, 'group_id' => $group_two->id]);
 *        MessageRecipient::create(['message_id' => $message_four->id, 'group_id' => $group_three->id]);
 */


        // now put an InboundSMS in there that we can ProcessInboundSMS on
        InboundSMS::create([
            'received_at' => Carbon::parse('2018-03-04 18:24:07'),
            'messageSid' => 'SM07c48fb2ac0393c17b5adac23584ef9e',
            'messagingServiceSid' => 'MG28310c22bea3fb0ada7d01667dbb2476',
            'fromPhone' => '+17046612244',
            'toPhone' => '+12028398478',
            'body' => 'Ok really it should work flawlessly this time',
            'shindig_id' => 1,
            'numMedia' => 0
        ]);

        Media::create([
            'date_created' => Carbon::parse('2018-03-04 19:24:07'),
            'media_sid' => 'SM07c48fb2ac0393c17b5adac23584ef5e',
            'parent_sid' => 'SM07c48fb2ac0393c17b5adac23584ef9e',
            'shindig_id' => 1,
            'content_type' => 'image/jpeg',
            'twilio_url' => 'something',
            's3_filename' => 'something',
        ]);
    }
}
