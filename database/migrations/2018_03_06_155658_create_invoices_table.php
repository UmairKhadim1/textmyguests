<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->bigInteger('user_id'); // any User who owns a shindig can pay for it, but an invoice only has one User
            $table->bigInteger('shindig_id'); // every invoice is associated with a single Shindig
            $table->string('stripe_id')->nullable(); // how to find this invoice in the Stripe API
            $table->integer('total_price')->default(0); // sum of 'line_price' on all line items, cents
            $table->integer('total_credits')->default(0); // sum of 'line_credits' on all line items
            $table->integer('paid_amount')->nullable(); // NULL until invoice is paid - even if 'paid' zero cents
            $table->DateTime('paid_at')->nullable(); // when the invoice was actually paid successfully
            $table->timestamps();
            $table->softDeletes(); // invoices seem sensitive, let's softDelete to be safe

            $table->index('user_id');
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
        Schema::dropIfExists('invoices');
    }
}
