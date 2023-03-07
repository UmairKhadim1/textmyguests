<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MakeGuestsNameNullable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('guests', function (Blueprint $table) {
            $table->string('guest_firstname')->nullable()->change();
            $table->string('guest_lastname')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('guests', function (Blueprint $table) {
            $table->string('guest_firstname')->change();
            $table->string('guest_lastname')->change();
        });
    }
}
