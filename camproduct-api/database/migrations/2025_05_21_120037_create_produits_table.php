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
            $table->text('description');
            $table->decimal('prix', 10, 2);
            $table->decimal('prix_promo', 10, 2)->nullable();
            $table->integer('stock')->default(10);
            $table->integer('stock_alerte')->default(5);
            $table->string('categorie');
            $table->string('sous_categorie')->nullable();
            $table->enum('statut', ['actif', 'inactif', 'brouillon'])->default('actif');
            $table->json('images')->nullable();
            $table->integer('ventes')->default(0);
            $table->integer('vues')->default(0);
            $table->integer('favoris')->default(0);
            $table->float('notation')->default(0);
            $table->integer('nombre_avis')->default(0);
            $table->boolean('visible')->default(true);
            $table->boolean('en_promotion')->default(false);
            $table->string('poids')->nullable();
            $table->string('origine')->nullable();
            $table->json('certifications')->nullable();
            $table->string('image_principale')->nullable(); // Ajoutez ce champ
            // $table->json('images')->nullable(); // Conservez ce champ pour d'autres images
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
