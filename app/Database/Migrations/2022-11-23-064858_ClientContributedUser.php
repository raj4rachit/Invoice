<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class ClientContributedUser extends Migration
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
            'client_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true
            ],
            'contributor_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true
            ],

        ]);

        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('subscriber_id', 'subscribers', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('client_id', 'clients', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('contributor_id', 'contributors', 'id', false, 'CASCADE');
        $this->forge->createTable('client_contributed_user');
    }

    public function down()
    {
        $this->forge->dropTable('client_contributed_user');
    }
}
