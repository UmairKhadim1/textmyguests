<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInvitationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invitations', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('shindig_id');
            $table->string('email'); // the email, the links was sent to
            $table->string('hash', 60)->unique(); // We follow the reset password pattern
            $table->integer('user_id')->nullable(); // an easy way to track if the invitation was accepted and retrieve the user
            $table->boolean('accepted')->default(false); // an easy way to track if the invitation was accepted and retrieve the user
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
        Schema::dropIfExists('invitations');
    }
}
