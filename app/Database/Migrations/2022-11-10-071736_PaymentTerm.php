<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class PaymentTerm extends Migration
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
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true
            ],
            'company_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true
            ],
            "title" => [
                "type" => "VARCHAR",
                "constraint" => 100,
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
        $this->forge->addForeignKey('company_id', 'companies', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('payment_terms');
    }

    public function down()
    {
        //
        $this->forge->dropTable("payment_terms");
    }
}
