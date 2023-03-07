<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddHiddenMessagesAndReplies extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->boolean('hidden')->after('promotion')->default(false);
        });

        Schema::table('inbound_sms', function (Blueprint $table) {
            $table->boolean('hidden')->after('body')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('messages,', function (Blueprint $table) {
            $table->dropColumn('hidden');
        });

        Schema::table('inbound_sms,', function (Blueprint $table) {
            $table->dropColumn('hidden');
        });
    }
}
