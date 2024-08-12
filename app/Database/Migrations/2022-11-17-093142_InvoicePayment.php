<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class InvoicePayment extends Migration
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
            'invoice_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true
            ],
            'payment_date' => [
                'type' => "DATE",
            ],
            'reference_no' => [
                'type' => "VARCHAR",
                'constraint' => 200,
            ],
            'payment_source_id' => [
                'type' => "INT",
                'constraint' => 11,
                'unsigned' => true
            ],
            'invoice_currency_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2]
            ],
            'tds' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2]
            ],
            'currency_conversion_rate' => [
                "type" => "DECIMAL",
                "constraint" => [16, 6]
            ],
            'company_currency_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                "default" => 0.00
            ],
            'difference_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2]
            ],
            'amount_without_tax' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2]
            ],
            'subscriber_ccr' => [
                "type" => "DECIMAL",
                "constraint" => [16, 6],
                "default" => 0.00
            ],
            'USD_ccr' => [
                "type" => "DECIMAL",
                "constraint" => [16, 6],
                "default" => 0.00
            ],
            'payment_status' => [
                "type" => "ENUM",
                "constraint" => ["Loss", "Profit", "Remaining", "Settled"]
            ],
            'status' => [
                "type" => "ENUM",
                "constraint" => ['Bad Debt', 'Due', 'Paid', 'Partial']
            ],
            'note' => [
                "type" => "TEXT",
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
                'type' => 'DATETIME',
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('invoice_id', 'invoices', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('invoice_payments');
    }

    public function down()
    {
        //
        $this->forge->dropTable('invoice_payments');
    }
}
