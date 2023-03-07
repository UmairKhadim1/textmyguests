<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use \App\Shindig;

class TrackShindigCityState extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // remove unified "location" column
        // add city, state, country_code columns
        Schema::table('shindigs', function (Blueprint $table) {
            $table->string('city')->after('location')->nullable();
            $table->string('state')->after('city')->nullable();
            $table->string('country_code')->after('state')->nullable();
        });

        // try to parse out existing locations with a comma-splice
        $shindigs = \App\Shindig::all();
        foreach ($shindigs as $shindig) {
            $location = explode(",", $shindig->location);
            if(isset($location[0]))
                $shindig->city = trim($location[0]);
            if(isset($location[1]))
                $shindig->state = trim($location[1]);
            $shindig->country_code = "US";
            $shindig->save();
        }

        Schema::table('shindigs', function (Blueprint $table) {
            $table->dropColumn('location');
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
            $table->string('location')->before('city')->nullable();
        });

        $shindigs = \App\Shindig::all();
        foreach ($shindigs as $shindig) {
            $shindig->location = implode(", ", array($shindig->city, $shindig->state));
            $shindig->save();
        }

        Schema::table('shindigs', function (Blueprint $table) {
            $table->dropColumn('city');
            $table->dropColumn('state');
            $table->dropColumn('country_code');
        });
    }
}
