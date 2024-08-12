<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class EmailConfigration extends Migration
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
            'company_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true
            ],
            'host' => [
                "type" => "VARCHAR",
                "constraint" => 100,
            ],
            'port' => [
                "type" => "INT",
                "constraint" => 11,
            ],
            'auth' => [
                "type" => "ENUM",
                "constraint" => ["TRUE", "FALSE"],
                "default" => "TRUE"
            ],
            'encryption' => [
                "type" => "ENUM",
                "constraint" => ["NONE", "TLS", "SSL"],
            ],
            'username' => [
                "type" => "VARCHAR",
                "constraint" => 100,
            ],
            'password' => [
                "type" => "VARCHAR",
                "constraint" => 100,
            ],
            'sender_email' => [
                "type" => "VARCHAR",
                "constraint" => 100,
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
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('email_configrations');
    }

    public function down()
    {
        //
        $this->forge->dropTable('email_configrations');
    }
}
