<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CountryTaxes extends Migration
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
            'country_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => true
            ],
            'tax_name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
            ],
            'rate' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
            ],
            'is_percentage' => [
                'type' => 'ENUM',
                'constraint' => ['Yes', 'No'],
                'default' => 'Yes'
            ],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['Active', 'Inactive'],
                'default' => 'Active'
            ],
            'created_by' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => true
            ],
            'updated_by' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => true
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
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('country_taxes');
    }

    public function down()
    {
        //
        $this->forge->dropTable('country_taxes');
    }
}
