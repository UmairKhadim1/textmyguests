<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMmsSupport extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // need to handle InboundSMS with no body (just an image)
        Schema::table('inbound_sms', function (Blueprint $table) {
            $table->string('body')->nullable()->change();
        });

        // just track the numMedia, we can retrieve later if need be
        Schema::table('activities', function (Blueprint $table) {
            $table->integer('numMedia')->nullable()->after('body');
        });

        // each MMS can have up to 10 images
        Schema::table('inbound_sms', function (Blueprint $table) {
            $table->string('MediaUrl0')->nullable();
            $table->string('MediaUrl1')->nullable();
            $table->string('MediaUrl2')->nullable();
            $table->string('MediaUrl3')->nullable();
            $table->string('MediaUrl4')->nullable();
            $table->string('MediaUrl5')->nullable();
            $table->string('MediaUrl6')->nullable();
            $table->string('MediaUrl7')->nullable();
            $table->string('MediaUrl8')->nullable();
            $table->string('MediaUrl9')->nullable();
        });

        // we can also support outbound images
        Schema::table('messages', function (Blueprint $table) {
            $table->string('media_url')->nullable()->after('contents');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->dropColumn('numMedia');
        });

        Schema::table('inbound_sms', function (Blueprint $table) {
            $table->dropColumn(['MediaUrl0', 'MediaUrl1', 'MediaUrl2', 'MediaUrl3', 'MediaUrl4', 'MediaUrl5', 'MediaUrl6', 'MediaUrl7', 'MediaUrl8', 'MediaUrl9']);
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn('media_url');
        });
    }
}
