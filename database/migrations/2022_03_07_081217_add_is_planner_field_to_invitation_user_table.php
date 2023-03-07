<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsPlannerFieldToInvitationUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->boolean('isPlanner')->after('accepted')->default(0);
        });
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('isPlanner')->after('isProfessional')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('invitation_user', function (Blueprint $table) {
            //
        });
    }
}
