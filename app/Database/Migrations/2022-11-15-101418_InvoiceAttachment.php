<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class InvoiceAttachment extends Migration
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
            'file_name' => [
                'type' => "VARCHAR",
                'constraint' => 200,
            ],
            'document' => [
                'type' => "VARCHAR",
                'constraint' => 200,
            ],
            'document_type_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true,
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
        $this->forge->addForeignKey('document_type_id', 'document_types', 'id', false, 'SET NULL');
        $this->forge->createTable('invoice_attachments');
    }

    public function down()
    {
        //
        $this->forge->dropTable('invoice_attachments');
    }
}
