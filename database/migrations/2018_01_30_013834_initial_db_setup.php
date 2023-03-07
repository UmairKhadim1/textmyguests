<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InitialDbSetup extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // create the basic tables we know we'll need for TextMyGuests

        // messages - the messages that are created by users
        Schema::create('messages', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->bigInteger('shindig_id');
            $table->string('message_name');
            $table->string('contents');
            $table->boolean('ready_to_send')->default(true); // usually, messages are ready to go when they're saved
            $table->dateTime('send_at')->nullable();
            $table->dateTime('sent')->nullable();
            $table->softDeletes(); // since we are going to reference message_ids in the activity table to create conversations

            $table->index('shindig_id');
        });

        // message_recipients - intersection table between messages and group_ids
        // NOTE: SET ONLY contact_id OR group_id, NEVER BOTH!
        Schema::create('message_recipients', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigInteger('message_id');
            $table->bigInteger('group_id');

            $table->index('message_id');
        });

        // activity - proof of what sms messages have been sent and received - timestamped with foreign keys back to message for sent
        Schema::create('activities', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->bigInteger('message_id')->nullable();
            $table->string('fromPhone', 12)->nullable(); // US number
            $table->string('toPhone', 12)->nullable();
            $table->string('body', 10240);
            $table->dateTime('occurred_at')->nullable();
            $table->string('messageSid', 100)->nullable(); // TODO find the right size
            $table->string('messagingServiceSid')->nullable();
            $table->string('twilioStatus')->nullable();

            $table->index('toPhone');
            $table->index('fromPhone');
            $table->index('message_id');
        });

        // shindigs - details about each shingdig aka shindig (each shindig can have multiple admin users)
        Schema::create('shindigs', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->string('name');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('location');
            $table->string('timezone'); // e.g. "America/Los_Angeles"
            $table->string('hash')->default(''); // FUTURE: to provide a secure URL for guests to join an shindig
        });

        // guests - the people who will receive messages
        // each guest may only attend a single shindig to avoid strange behavior
        Schema::create('guests', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->bigInteger('shindig_id');
            $table->string('guest_firstname');
            $table->string('guest_lastname');
            $table->string('guest_phone')->nullable();
            $table->string('guest_email')->nullable(); // FUTURE: to be used to send guests a link and provide a cell number
            $table->string('guest_hash')->default(''); // FUTURE: to be used so guests can visit a secure link and provide a phone

            $table->index('shindig_id');
        });

        // groups - these are sub-sets of a user's contacts (best men, wedding party, etc)
        // groups exist at the shindig level
        Schema::create('groups', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->bigInteger('shindig_id');
            $table->string('group_name');
            $table->string('group_desc');
            $table->boolean('is_all')->default(false); // if true, this is the placeholder to send to all an shindig's guests
        });

        // group_membership - intersection table showing which guests are in which groups
        Schema::create('group_membership', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigInteger('group_id');
            $table->bigInteger('guest_id');

            $table->index('group_id');
        });

        // shindig_ownership - intersection table showing which users own which shindigs
        Schema::create('shindig_ownership', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->BigInteger('shindig_id');
            $table->integer('user_id');

            $table->index('user_id');
        });

        // templates - example messages provided to inspire users
        Schema::create('templates', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->increments('id');
            $table->string('template_grouping');
            $table->string('template_name');
            $table->string('template_contents');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // remove tables
        Schema::dropIfExists('messages');
        Schema::dropIfExists('message_recipients');
        Schema::dropIfExists('recipients');
        Schema::dropIfExists('activities');
        Schema::dropIfExists('events');
        Schema::dropIfExists('shindigs');
        Schema::dropIfExists('guests');
        Schema::dropIfExists('groups');
        Schema::dropIfExists('group_membership');
        Schema::dropIfExists('shindig_ownership');
        Schema::dropIfExists('templates');
        Schema::dropIfExists('plans');
    }
}
