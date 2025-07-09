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
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produit_id')->constrained('produits')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('entreprise_id')->constrained('entreprises')->onDelete('cascade');
            $table->integer('quantite');
            $table->decimal('prix_total', 10, 2);
            $table->enum('statut', ['en_attente', 'confirme', 'annule'])->default('en_attente');
            $table->string('adresse_livraison')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
