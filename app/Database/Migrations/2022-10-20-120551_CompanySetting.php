<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CompanySetting extends Migration
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
                "type" => "int",
                "constraint" => 11,
                'unsigned' => true
            ],
            'company_logo' => [
                "type" => "VARCHAR",
                "constraint" => 100
            ],
            'company_code' => [
                "type" => "VARCHAR",
                "constraint" => 255,
                "null" => true
            ],
            'invoice_prefix_date_format' => [
                "type" => "VARCHAR",
                "constraint" => 255,
                "null" => true
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
        $this->forge->createTable('company_settings');
    }

    public function down()
    {
        $this->forge->dropTable('company_settings');
    }
}
