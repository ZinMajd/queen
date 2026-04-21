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
        Schema::table('dresses', function (Blueprint $table) {
            $table->boolean('is_for_sale')->default(false)->after('status');
            $table->boolean('is_for_rent')->default(true)->after('is_for_sale');
            $table->string('sale_price')->nullable()->after('is_for_rent');
            $table->string('rent_price')->nullable()->after('sale_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dresses', function (Blueprint $table) {
            $table->dropColumn(['is_for_sale', 'is_for_rent', 'sale_price', 'rent_price']);
        });
    }
};
