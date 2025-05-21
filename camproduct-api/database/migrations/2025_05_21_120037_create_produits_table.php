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
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entreprise_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->string('categorie');
            $table->text('description');
            $table->decimal('prix', 10, 2);
            $table->text('ingredients')->nullable();
            $table->string('region')->nullable();
            $table->string('image')->nullable();
            $table->boolean('disponible_en_gros')->default(false);//disponible en gros ou non
            $table->boolean('actif')->default(true);//disponible ou non
            $table->enum('status', ['en_attente', 'approuve', 'rejete'])->default('en_attente');
            // $table->date('date_ajout')->nullable();
            $table->integer('quantite_stock');
            $table->integer('quantite_min_gros');
            // $table->integer('nombre_de vues');

            $table->date('date_modification')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
