<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFriendinvitationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('friendinvitation', function (Blueprint $table) {
            $table->unsignedBigInteger("requester");
            $table->unsignedBigInteger("requested");

            $table->foreign("requester")->references("id")->on("user");
            $table->foreign("requested")->references("id")->on("user");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('friendinvitation');
    }
}
