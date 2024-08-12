<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class ContributionRatio extends Migration
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
            "title" => [
                "type" => "VARCHAR",
                "constraint" => 100,
            ],
            "ratio" => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
            ],
            "description" => [
                "type" => "TEXT",
                "null" => true
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
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('contribution_ratio');
    }

    public function down()
    {
        $this->forge->dropTable('contribution_ratio');
    }
}
