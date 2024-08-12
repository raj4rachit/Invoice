<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Client extends Migration
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
         'subscriber_id' => [
            "type" => "int",
            "constraint" => 11,
            'unsigned' => true
         ],
         'client_name' => [
            "type" => "VARCHAR",
            "constraint" => 100
         ],
         'company_name' => [
            "type" => "VARCHAR",
            "constraint" => 255,
            "null" => true
         ],
         'enroll_date' => [
            "type" => "DATE",
         ],
         'tax_no' => [
            "type" => "VARCHAR",
            "constraint" => 100
         ],
         'gst_vat_no' => [
            "type" => "VARCHAR",
            "constraint" => 100
         ],
         'email' => [
            "type" => "VARCHAR",
            "constraint" => 100
         ],
         'phone' => [
            "type" => "VARCHAR",
            "constraint" => 100
         ],
         'address_1' => [
            "type" => "VARCHAR",
            "constraint" => 100
         ],
         'address_2' => [
            "type" => "VARCHAR",
            "constraint" => 100,
            'null' => true
         ],
         'city' => [
            "type" => "VARCHAR",
            "constraint" => 100,
            'null' => true
         ],
         'state' => [
            "type" => "VARCHAR",
            "constraint" => 100,
            'null' => true
         ],
         'zip_code' => [
            "type" => "VARCHAR",
            "constraint" => 100,
            'null' => true
         ],
         'country_id' => [
            "type" => "INT",
            "constraint" => 11,
            'unsigned' => true
         ],
         'source_by' => [
            "type" => "INT",
            "constraint" => 11,
            'unsigned' => true,
            'null' => true
         ],
         'source_from' => [
            "type" => "INT",
            "constraint" => 11,
            'unsigned' => true,
            'null' => true
         ],
         'client_group_id' => [
            "type" => "INT",
            "constraint" => 100,
            'unsigned' => true,
            'null' => true
         ],
         'is_bifurcated' => [
            'type' => 'ENUM',
            'constraint' => ['Yes', 'No'],
            'default' => 'No'
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
            "type" => "DATETIME",
         ],
         'updated_at' => [
            'type' => 'DATETIME',
            'null' => true,
         ]
      ]);
      $this->forge->addKey('id', true);
      $this->forge->addForeignKey('subscriber_id', 'subscribers', 'id', false, 'CASCADE');
      $this->forge->addForeignKey('country_id', 'countries', 'id', false, 'SET NULL');
      $this->forge->addForeignKey('source_by', 'contributors', 'id', false, 'SET NULL');
      $this->forge->addForeignKey('source_from', 'source_platforms', 'id', false, 'SET NULL');
      $this->forge->addForeignKey('client_group_id', 'client_groups', 'id', false, 'SET NULL');
      $this->forge->addForeignKey('created_by', 'users', 'id', false, 'SET NULL');
      $this->forge->addForeignKey('updated_by', 'users', 'id', false, 'SET NULL');
      $this->forge->createTable('clients');
   }

   public function down()
   {
      //
      $this->forge->dropTable('clients');
   }
}
