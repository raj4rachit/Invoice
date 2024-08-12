<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class InvoiceItemType extends Migration
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
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => true,
            ],
            'item_type_name' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'is_date' => [
                'type' => 'ENUM',
                'constraint' => ['Yes', 'No'],
                'default' => 'No'
            ],
            'date_type' => [
                'type' => 'ENUM',
                'constraint' => ['days', 'months', 'years'],
                'default' => 'days'
            ],
            'date_no' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 1
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
                'type' => 'DATETIME',
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('subscriber_id', 'subscribers', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('created_by', 'users', 'id', false, 'CASCADE');
        $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('invoice_item_types');
    }

    public function down()
    {
        $this->forge->dropTable('invoice_item_types');
    }
}
