<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class InvoiceTax extends Migration
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
            'tax_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true
            ],
            'invoice_item_id' => [
                'type' => 'VARCHAR',
                'constraint' => 100
            ],
            'is_percentage' => [
                "type" => "ENUM",
                "constraint" => ["Yes", "No"],
                "default" => "Yes"
            ],
            'tax_rate' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                "default" => 0.00
            ],
            'tax_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                "default" => 0.00
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
        $this->forge->addForeignKey('tax_id', 'country_taxes', 'id', false, 'CASCADE');
        $this->forge->createTable('invoice_taxes');
    }

    public function down()
    {
        //
        $this->forge->dropTable('invoice_taxes');
    }
}
