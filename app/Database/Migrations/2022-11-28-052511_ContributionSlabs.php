<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class ContributionSlabs extends Migration
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
            'user_contribution_id' => [
                "type" => "INT",
                "constraint" => 11,
                'unsigned' => true
            ],
            'from' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                'default' => 0.00
            ],
            'to' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                'default' => 0.00
            ],
            'amount_type' => [
                "type" => "ENUM",
                'constraint' => ["%", "Flat"],
                'default' => '%'
            ],
            'amount' => [
                "type" => "DECIMAL",
                "constraint" => [16, 2],
                'default' => 0.00
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('user_contribution_id', 'user_contributions', 'id', false, 'CASCADE');
        $this->forge->createTable('contribution_slabs');
    }

    public function down()
    {
        $this->forge->dropTable('contribution_slabs');
    }
}
