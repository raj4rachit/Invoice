<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Income extends Migration
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
            'company_id' => [
                "type" => "int",
                "constraint" => 11,
                'unsigned' => true
            ],
            'category_id' => [
                "type" => "int",
                "constraint" => 11,
                'unsigned' => true
            ],
            'subcategory_id' => [
                "type" => "int",
                "constraint" => 11,
                'unsigned' => true
            ],
            'title' => [
                "type" => "VARCHAR",
                "constraint" => 100
            ],
            'date' => [
                "type" => "DATE",
            ],
            'amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                "default" => 0.00,
            ],
            'subscriber_ccr' => [
                "type" => "DECIMAL",
                "constraint" => [16, 6],
                "default" => 0.00,
            ],
            'subscriber_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                "default" => 0.00,
            ],
            'USD_ccr' => [
                "type" => "DECIMAL",
                "constraint" => [16, 6],
                "default" => 0.00,
            ],
            'USD_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                "default" => 0.00,
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
                "type" => "DATETIME",
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('subscriber_id', 'subscribers', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('company_id', 'companies', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('category_id', 'income_categories', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('subcategory_id', 'income_categories', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('incomes');
    }

    public function down()
    {
        $this->forge->dropTable('incomes');
    }
}
