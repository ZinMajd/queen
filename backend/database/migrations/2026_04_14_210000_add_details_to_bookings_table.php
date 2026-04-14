<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('delivery_method')->default('استلام من المحل')->after('booking_date');
            $table->text('delivery_address')->nullable()->after('delivery_method');
            $table->string('payment_method')->default('كاش عند الاستلام')->after('delivery_address');
            $table->decimal('total_amount', 10, 2)->default(0)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['delivery_method', 'delivery_address', 'payment_method', 'total_amount']);
        });
    }
};
