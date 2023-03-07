<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInboundSMSTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inbound_sms', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->bigInteger('shindig_id');
            $table->dateTimeTz('received_at');
            $table->string('messageSid');
            $table->string('messagingServiceSid')->nullable();
            $table->string('fromPhone')->nullable();
            $table->string('toPhone')->nullable();
            $table->string('body', 10240)->nullable();
            $table->integer('numMedia');
            $table->dateTimeTz('processed_at')->nullable();

            $table->index('shindig_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inbound_sms');
    }
}
