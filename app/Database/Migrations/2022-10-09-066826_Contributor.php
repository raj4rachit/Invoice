<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Contributor extends Migration
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
                "type" => "int",
                "constraint" => 11,
                'unsigned' => true
            ],
            'first_name' => [
                "type" => "VARCHAR",
                "constraint" => "200",
            ],
            'last_name' => [
                "type" => "VARCHAR",
                "constraint" => "200",
            ],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['Active', 'Inactive'],
                'default' => 'Active'
            ],
            'created_at' => [
                "type" => "DATETIME",
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('subscriber_id', 'subscribers', 'id', false, 'CASCADE');

        $this->forge->createTable('contributors');
    }

    public function down()
    {
        $this->forge->dropTable('contributors');
    }
}
