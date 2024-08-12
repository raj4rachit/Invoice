<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AppToken extends Migration
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
            'user_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true
            ],
            'token' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
            ],
            'ip_address' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => true,
            ],
            'device_type' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => true,
            ],
            'platform_name' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true,
            ],
            'platform_agent' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true,
            ],
            'device_id' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true,
            ],
            'device_name' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true,
            ],
            'type' => [
                'type' => 'ENUM',
                'constraint' => ['Login', 'Forgot'],
                'default' => 'Login'
            ],
            'expired_at' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true,
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
        $this->forge->addForeignKey('user_id', 'users', 'id', false, 'CASCADE');
        $this->forge->createTable('app_token');
    }

    public function down()
    {
        $this->forge->dropTable('app_token');
    }
}
