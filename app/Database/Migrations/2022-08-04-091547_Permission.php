<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Permission extends Migration
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
            'slug' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'unique'     => true,
            ],
            'url' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'unique'     => true,
            ],
            'is_default' => [
                'type' => 'ENUM',
                'constraint' => ['Yes', 'No'],
                'default' => 'No'
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('permissions');
    }

    public function down()
    {
        $this->forge->dropTable('permissions');
    }
}
