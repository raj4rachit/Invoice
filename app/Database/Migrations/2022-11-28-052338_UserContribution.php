<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UserContribution extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true
            ],
            'subscriber_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true
            ],
            'contributor_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true
            ],
            'roll_over_month' => [
                "type" => "INT",
                "constraint" => 11,
                "null" => true
            ],
            'roll_over_bill' => [
                "type" => "INT",
                "constraint" => 11,
                "null" => true
            ]
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('subscriber_id', 'subscribers', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('contributor_id', 'contributors', 'id', false, 'CASCADE');
        $this->forge->createTable('user_contributions');
    }

    public function down()
    {
        $this->forge->dropTable('user_contributions');
    }
}
