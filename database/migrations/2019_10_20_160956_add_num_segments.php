<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNumSegments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->unsignedSmallInteger('numSegments')->nullable()->after('twilioStatus');
        });

        Schema::table('inbound_sms', function (Blueprint $table) {
            $table->unsignedSmallInteger('numSegments')->nullable()->after('body');
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
            $table->dropColumn('numSegments');
        });

        Schema::table('inbound_sms', function (Blueprint $table) {
            $table->dropColumn('numSegments');
        });
    }
}
