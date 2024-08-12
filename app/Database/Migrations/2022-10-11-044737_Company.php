<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Company extends Migration
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
            'company_name' => [
                "type" => "VARCHAR",
                "constraint" => 255
            ],
            'trading_name' => [
                "type" => "VARCHAR",
                "constraint" => 100
            ],
            'email' => [
                "type" => "VARCHAR",
                "constraint" => 100
            ],
            'contact_number' => [
                "type" => "VARCHAR",
                "constraint" => 100
            ],
            'website' => [
                "type" => "VARCHAR",
                "constraint" => 100
            ],
            'registration_no' => [
                "type" => "VARCHAR",
                "constraint" => 100,
                "null" => true
            ],
            'enroll_date' => [
                "type" => "DATE",
            ],
            'tax_no' => [
                "type" => "VARCHAR",
                "constraint" => 100,
                "null" => true
            ],
            'gst_vat_no' => [
                "type" => "VARCHAR",
                "constraint" => 100,
                "null" => true
            ],
            'currency_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true
            ],
            'address_1' => [
                "type" => "VARCHAR",
                "constraint" => 100
            ],
            'address_2' => [
                "type" => "VARCHAR",
                "constraint" => 100,
                'null' => true
            ],
            'city' => [
                "type" => "VARCHAR",
                "constraint" => 100,
                'null' => true
            ],
            'state' => [
                "type" => "VARCHAR",
                "constraint" => 100,
                'null' => true
            ],
            'zip_code' => [
                "type" => "VARCHAR",
                "constraint" => 100,
                'null' => true
            ],
            'country_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true
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
                "type" => "DATETIME",
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('subscriber_id', 'subscribers', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('country_id', 'countries', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('currency_id', 'currencies', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('companies');
    }

    public function down()
    {
        $this->forge->dropTable('companies');
    }
}
