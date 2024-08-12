<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CompanyUser extends Migration
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
            'company_id' => [
                "type" => "INT",
                "constraint" => 100,
                "unsigned" => true,
            ],
            'user_id' => [
                "type" => "INT",
                "constraint" => 100,
                "unsigned" => true,
            ],
            'is_default' => [
                'type' => 'ENUM',
                'constraint' => ['Yes', 'No'],
                'default' => 'Yes'
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
        $this->forge->addForeignKey('company_id', 'companies', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('user_id', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('company_users');
    }

    public function down()
    {
        $this->forge->dropTable('company_users');
    }
}
