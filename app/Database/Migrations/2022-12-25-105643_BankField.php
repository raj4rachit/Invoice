<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class BankField extends Migration
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
            'company_bank_id' => [
                "type" => "int",
                "constraint" => 11,
                'unsigned' => true
            ],
            'key' => [
                "type" => "VARCHAR",
                "constraint" => "200",
            ],
            'value' => [
                "type" => "TEXT",
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
        $this->forge->addForeignKey('company_bank_id', 'company_banks', 'id', false, 'CASCADE');
        
        $this->forge->createTable('bank_fields');
    }

    public function down()
    {
        //
        $this->forge->dropTable('bank_fields');
    }
}
