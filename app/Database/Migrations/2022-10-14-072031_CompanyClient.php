<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CompanyClient extends Migration
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
            'client_id' => [
                "type" => "INT",
                "constraint" => 100,
                "unsigned" => true,
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
        $this->forge->addForeignKey('client_id', 'clients', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('company_clients');
    }

    public function down()
    {
        //
        $this->forge->dropTable('company_clients');
    }
}
