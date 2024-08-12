<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Currency extends Migration
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
            'currency_name' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'currency_symbol' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'short_code' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'locale' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null'  => true
            ],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['Active', 'Inactive'],
                'default' => 'Active'
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
        $this->forge->createTable('currencies');
    }

    public function down()
    {
        $this->forge->dropTable('currencies');
    }
}
