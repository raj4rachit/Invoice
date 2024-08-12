<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class PermissionGroup extends Migration
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
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'permissions' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            
            'restrictions' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'subscriber_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => true,
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
        $this->forge->addForeignKey('subscriber_id', 'subscribers', 'id', false, 'CASCADE');
        $this->forge->createTable('permission_group');
    }

    public function down()
    {
        $this->forge->dropTable('permission_group');
    }
}
