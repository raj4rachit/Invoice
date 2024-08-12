<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class InvoiceBank extends Migration
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
                "type" => "int",
                "constraint" => 11,
                'unsigned' => true
            ],
            'company_bank_id' => [
                "type" => "int",
                "constraint" => 11,
                'unsigned' => true
            ],
            'created_at' => [
                "type" => "DATETIME",
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('invoice_id', 'invoices', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('company_bank_id', 'company_banks', 'id', false, 'CASCADE');
        
        $this->forge->createTable('invoice_banks');
    }

    public function down()
    {
        //
        $this->forge->dropTable('invoice_banks');
    }
}
