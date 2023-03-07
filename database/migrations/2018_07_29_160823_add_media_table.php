<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMediaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('media', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->bigInteger('shindig_id'); // every Media is associated with a single Shindig
            $table->string('content_type')->nullable();
            $table->string('parent_sid')->nullable(); // SID of the incoming message that carried this media
            $table->string('media_sid')->nullable(); // SID of this media
            $table->string('twilio_url')->nullable(); // URL to the original media hosted on Twilio (don't trust this long term) relative to https://api.twilio.com
            $table->string('s3_filename')->nullable(); // folder and filename of the media's location in the s3 bucket
            $table->DateTime('date_created')->nullable(); // from twilio
            $table->timestamps();
            $table->softDeletes(); // images seem important, let's softDelete to be safe

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
        Schema::dropIfExists('media');
    }
}
