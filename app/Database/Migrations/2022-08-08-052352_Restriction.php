<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Restriction extends Migration
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
            'permission_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'slug' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique'     => true,
            ],
            'description' => [
                'type' => 'TEXT',
            ],
            'created_at' => [
                'type' => 'DATETIME',
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('permission_id', 'permissions', 'id', false, 'CASCADE');
        $this->forge->createTable('restrictions');
    }

    public function down()
    {
        $this->forge->dropTable('restrictions');
    }
}
