<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Invoice extends Migration
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
            'invoice_no' => [
                "type" => "VARCHAR",
                "constraint" => 100
            ],
            'invoice_date' => [
                "type" => "DATE",
            ],
            'invoice_due_date' => [
                "type" => "DATE",
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
            'client_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true,
            ],
            'company_financial_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true,
            ],
            'is_bifurcated' => [
                "type" => "ENUM",
                'constraint' => ['Yes', 'No'],
                'default' => 'No'
            ],
            'discount_type' => [
                "type" => "VARCHAR",
                'constraint' => 255,
                'null' => true
            ],
            'is_display_company_amount' => [
                "type" => "ENUM",
                'constraint' => ["Yes", "No"],
                'default' => 'No'
            ],
            'invoice_currency_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true,
            ],
            'company_currency_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true,
            ],
            'invoice_currency_total_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
            ],
            'company_currency_total_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
            ],
            'currency_conversion_rate' => [
                "type" => "DECIMAL",
                "constraint" => [16, 6],
                'default' => 0.00
            ],
            'invoice_currency_amount_received' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                'default' => 0.00
            ],
            'company_currency_amount_received' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                'default' => 0.00
            ],
            'total_tax_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
            ],
            'total_discount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                'default' => 0.00
            ],
            'total_deduction' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                'default' => 0.00
            ],
            'subtotal' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                'default' => 0.00
            ],
            'invoice_status' => [
                "type" => "VARCHAR",
                "constraint" => 255,
            ],
            'term_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true,
                "null" => true,
            ],
            'total_remaining_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                'default' => 0.00
            ],
            'total_difference' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                'default' => 0.00
            ],
            'subscriber_currency_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true,
            ],
            'subscriber_currency_conversion_rate' => [
                "type" => "DECIMAL",
                "constraint" => [16, 6],
                'default' => 0.00
            ],
            'subscriber_currency_total_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                'default' => 0.00
            ],
            'USD_currency_conversion_rate' => [
                "type" => "DECIMAL",
                "constraint" => [16, 6],
                'default' => 0.00
            ],
            'USD_currency_total_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                'default' => 0.00
            ],
            'invoice_note' => [
                'type' => 'TEXT',
                'null' => true
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
        $this->forge->addForeignKey('client_id', 'clients', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('company_financial_id', 'company_financial_years', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('invoice_currency_id', 'currencies', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('company_currency_id', 'currencies', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('subscriber_currency_id', 'currencies', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('company_id', 'companies', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('term_id', 'payment_terms', 'id', false, 'SET NULL');
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('invoices');
    }

    public function down()
    {
        //
        $this->forge->dropTable('invoices');
    }
}
