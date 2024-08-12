<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CompanyFinancialYear extends Migration
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
                "constraint" => 100,
                "unsigned" => true,
            ],
            'company_id' => [
                "type" => "INT",
                "constraint" => 100,
                "unsigned" => true,
            ],
            'financial_year_name' => [
                "type" => "VARCHAR",
                "constraint" => 100
            ],
            'start_date' => [
                "type" => "DATE",
            ],
            'end_date' => [
                "type" => "DATE",
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
        $this->forge->addForeignKey('subscriber_id', 'subscribers', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('company_id', 'companies', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('company_financial_years');
    }

    public function down()
    {
        //
        $this->forge->dropTable('company_financial_years');
    }
}
