<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMultiNumberSupport extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // neach Shindig gets its own dedicated messaging service
        Schema::table('shindigs', function (Blueprint $table) {
            $table->string('messagingServiceSid')->nullable()->after('timezone');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shindigs', function (Blueprint $table) {
            $table->dropColumn('messagingServiceSid');
        });
    }
}
