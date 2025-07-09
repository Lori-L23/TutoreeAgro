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
        Schema::create('entreprises', function (Blueprint $table) {
            $table->id();
            $table->foreignId(column: 'user_id')->constrained('users')->onDelete('cascade');
            $table->string('nom_entreprise')->nullable();
            $table->string('siret')->nullable();
            $table->string('logo')->nullable();
            $table->string('activity_sector')->nullable();
            $table->string('documents_path')->nullable();
            $table->enum('status', ['en_attente', 'approuve', 'rejete'])->default('en_attente');
            // $table->date('date_veri fication')->nullable();
            $table->string('region');
            $table->string('ville');
            // $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entreprises');
    }
};
