<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGameTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('game', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("player1");
            $table->unsignedBigInteger("player2");
            $table->unsignedBigInteger("player3");
            $table->unsignedBigInteger("player4");

            $table->unsignedInteger("scorelimit");
            $table->unsignedInteger("scoreteam1");
            $table->unsignedInteger("scoreteam2");
            $table->enum("gamestate", ["CREATED", "ABORTED", "PLAYING", "WONTEAM1", "WONTEAM2"]);
            $table->timestamps();
            $table->foreign("player1")->references("id")->on("user");
            $table->foreign("player2")->references("id")->on("user");
            $table->foreign("player3")->references("id")->on("user");
            $table->foreign("player4")->references("id")->on("user");
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('game');
    }
}
