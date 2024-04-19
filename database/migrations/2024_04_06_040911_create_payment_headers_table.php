<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('header_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('header_transaction_id')->constrained('header_transactions','id');
            $table->integer('payment_remaining_amount')->nullable();
            $table->string('payment_status');
            $table->string('created_by');
            $table->string('updated_by')->nullable();
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
        Schema::dropIfExists('payment_headers');
    }
};
