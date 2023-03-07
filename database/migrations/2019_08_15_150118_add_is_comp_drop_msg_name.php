<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsCompDropMsgName extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shindigs', function (Blueprint $table) {
            $table->boolean('is_comp')->after('is_demo')->default(0);
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn('message_name');
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
            $table->dropColumn('is_comp');
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->string('message_name')->after('shindig_id');
        });
    }
}
