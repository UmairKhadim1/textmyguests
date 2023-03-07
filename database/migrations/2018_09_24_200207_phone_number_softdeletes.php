<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class PhoneNumberSoftdeletes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('phone_numbers', function (Blueprint $table) {
            $table->boolean('dont_release')->after('sid')->default(0);
            $table->dropColumn('released_at');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('phone_numbers', function (Blueprint $table) {
            $table->dropColumn('dont_release');
            $table->dropColumn('deleted_at');
            $table->dateTime('released_at');
        });
    }
}
