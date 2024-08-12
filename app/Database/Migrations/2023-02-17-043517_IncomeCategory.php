<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class IncomeCategory extends Migration
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
            "name" => [
                "type" => "VARCHAR",
                "constraint" => 100,
            ],
            'parent_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true,
                "nullable" => true,
                "default" => null
            ],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['Active', 'Inactive'],
                'default' => 'Active'
            ],
            "created_by" => [
                "type" => "INT",
                "constraint" => 11,
                "unsigned" => true
            ],
            "updated_by" => [
                "type" => "INT",
                "constraint" => 11,
                "unsigned" => true,
                "null" => true,
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
        $this->forge->addForeignKey('parent_id', 'income_categories', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('income_categories');
    }

    public function down()
    {
        $this->forge->dropTable('income_categories');
    }
}
