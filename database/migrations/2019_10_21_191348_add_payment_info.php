<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPaymentInfo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->string('stripe_id')->nullable()->after('paid_at')->change();
            $table->string('card_last4', 4)->nullable()->after('paid_at');
            $table->string('card_type')->nullable()->after('paid_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn('stripe_id');
            $table->dropColumn('card_type');
            $table->dropColumn('card_last4');
        });
    }
}
