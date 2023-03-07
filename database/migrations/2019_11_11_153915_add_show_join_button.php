<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddShowJoinButton extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shindigs', function (Blueprint $table) {
            $table->boolean('show_join_button')->default(TRUE);
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
            $table->dropColumn('show_join_button');
        });
    }
}
