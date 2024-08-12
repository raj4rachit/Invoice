<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Subscriber extends Migration
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
            'official_name' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'first_name' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'last_name' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'email' => [
                'type' => 'VARCHAR',
                'constraint' => '150',
            ],
            'phone' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
            ],
            'logo' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
            ],
            'address_1' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
            ],
            'address_2' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'city' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'state' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'zipcode' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'country_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true
            ],
            'currency_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true
            ],
            'financial_start_date' => [
                "type" => "DATE",
            ],
            'financial_end_date' => [
                "type" => "DATE",
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
        $this->forge->addForeignKey('country_id', 'countries', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('currency_id', 'currencies', 'id', false, 'CASCADE');
        $this->forge->createTable('subscribers');
    }

    public function down()
    {
        $this->forge->dropTable('subscribers');
    }
}
