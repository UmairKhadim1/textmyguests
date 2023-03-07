<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ClarifyIsActivated extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shindigs', function (Blueprint $table) {
            $table->dropColumn('is_comp');
        });

        Schema::table('shindigs', function (Blueprint $table) {
            $table->dropColumn('is_demo');
        });

        Schema::table('shindigs', function (Blueprint $table) {
            $table->boolean('is_activated')->default(0);
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
            $table->boolean('is_demo')->default(0);
        });

        Schema::table('shindigs', function (Blueprint $table) {
            $table->boolean('is_comp')->default(0);
        });
    }
}
