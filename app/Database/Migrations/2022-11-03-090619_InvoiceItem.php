<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class InvoiceItem extends Migration
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
                'unsigned' => true,
            ],
            'item_type_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true
            ],
            'client_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true
            ],
            'is_bifurcated' => [
                "type" => "ENUM",
                'constraint' => ['Yes', 'No'],
                'default' => 'No'
            ],
            'resource_name' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
            ],
            'start_date' => [
                'type' => 'DATE',
            ],
            'end_date' => [
                'type' => 'DATE',
            ],
            'actual_days' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
            ],
            'working_days' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
            ],
            'resource_quantity' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
            ],
            'rate' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
            ],
            'deduction' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
            ],
            'tax_rate' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
            ],
            'tax_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
            ],
            'discount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                "default" => 0.00
            ],
            'discount_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                "default" => 0.00
            ],
            'subtotal' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                "default" => 0.00,
                "comment" => "Before Discount and Tax Apply."
            ],
            'total_amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                "default" => 0.00,
                "comment" => "After Discount and Tax Apply"
            ],
            'description' => [
                "type" => "LONGTEXT",
                "null" => true
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
        $this->forge->addForeignKey('client_id', 'clients', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('item_type_id', 'invoice_item_types', 'id', false, 'CASCADE');
        $this->forge->createTable('invoice_items');
    }

    public function down()
    {
        //
        $this->forge->dropTable('invoice_items');
    }
}
