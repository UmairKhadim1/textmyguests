<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SingleDateForEvent extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shindigs', function (Blueprint $table) {
            $table->date('event_date')->after('name')->default(Carbon::now()->toDateString());
        });
        DB::table('shindigs')->chunkById(100, function($shindigs) {
            foreach($shindigs as $shindig) {
                $start_date = new Carbon($shindig->start_date);
                $end_date = new Carbon($shindig->end_date);
                $half_period = $end_date->diffInDays($start_date) / 2;
                $event_date = $start_date
                    ->addDays(ceil($half_period))
                    ->toDateString();
                DB::table('shindigs')
                    ->where('id', $shindig->id)
                    ->update(['event_date' => $event_date]);
            }
        });
        Schema::table('shindigs', function (Blueprint $table) {
            $table->dropColumn('start_date');
            $table->dropColumn('end_date');
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
            $table->date('start_date')->after('name');
            $table->date('end_date')->after('start_date');
        });
        DB::table('shindigs')->chunkById(100, function($shindigs) {
            foreach($shindigs as $shindig) {
                $event_date = new Carbon($shindig->event_date);
                $start_date = $event_date
                    ->subDays(30)
                    ->toDateString();
                $end_date = $event_date
                    ->addDays(30)
                    ->toDateString();
                DB::table('shindigs')
                    ->where('id', $shindig->id)
                    ->update([
                        'start_date' => $start_date,
                        'end_date' => $end_date,
                    ]);
            }
        });
        Schema::table('shindigs', function (Blueprint $table) {
            $table->dropColumn('event_date');
        });
    }
}
