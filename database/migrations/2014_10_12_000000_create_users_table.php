<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->increments('id');
            $table->string('name');
            // https://stackoverflow.com/questions/1814532/1071-specified-key-was-too-long-max-key-length-is-767-bytes
            // Don't add an index on a varchar column with an unspecified length
            $table->string('email', 120)->unique(); 
            $table->string('mobilePhone', 12)->unique(); // +1XXXXXXXXXXXX (US number)
            $table->string('password');
            $table->string('apiKey')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
