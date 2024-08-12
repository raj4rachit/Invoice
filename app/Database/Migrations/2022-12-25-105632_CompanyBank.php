<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CompanyBank extends Migration
{
    public function up()
    {
        //
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
            'bank_name' => [
                "type" => "varchar",
                "constraint" => 255
            ],
            'bank_detail_name' => [
                "type" => "VARCHAR",
                "constraint" => 100
            ],
            'account_number' => [
                "type" => "VARCHAR",
                "constraint" => 200 
            ],
            'account_name' => [
                "type" => "VARCHAR",
                "constraint" => 200
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
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('company_banks');
    }

    public function down()
    {
        //
        $this->forge->dropTable('company_banks');
    }
}
