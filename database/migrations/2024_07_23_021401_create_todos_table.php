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
        Schema::create('todos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description');
            $table->enum('status', ['Pending', 'completed', 'Canceled'])->default('Pending');
            $table->foreignId('user_ID')->nullable();
            $table->foreign('user_ID')->references('id')->on('users');
                
            $table->timestamps();
        
            // $table->foreignId('categorie_ID');
            // $table->foreign('categorie_ID')->references('id')->on('categories');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('todos');
    }
};
