<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class DocumentTypes extends Migration
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
            'name' => [
                "type" => "VARCHAR",
                "constraint" => 255,
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
                "type" => "DATETIME",
                "null" => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('subscriber_id', 'subscribers', 'id', false, 'CASCADE');

        $this->forge->createTable('document_types');
    }

    public function down()
    {
        $this->forge->dropTable('document_types');
    }
}
