<?php

namespace App\Database\Seeds;

use App\Models\Restriction;
use CodeIgniter\Database\Seeder;
use CodeIgniter\I18n\Time;

class RestrictionSeeder extends Seeder
{
    public function run()
    {
        $defaultRestriction = [

            // Main Menu
            # Dashboard - 1

            # Subscriber - 2
            ["permission_id" => 2, "name" => 'Can add subscriber', "slug" => 'CAN_ADD_SUBSCRIBER', "description" => 'Can add subscriber', "created_at" => Time::now()],
            ["permission_id" => 2, "name" => 'Can edit subscriber', "slug" => 'CAN_EDIT_SUBSCRIBER', "description" => 'Can edit subscriber', "created_at" => Time::now()],
            ["permission_id" => 2, "name" => 'Can delete subscriber', "slug" => 'CAN_DELETE_SUBSCRIBER', "description" => 'Can delete subscriber', "created_at" => Time::now()],

            # Invoice - 3
            ["permission_id" => 3, "name" => 'Can add invoice', "slug" => 'CAN_ADD_INVOICE', "description" => 'Can add invoice', "created_at" => Time::now()],
            ["permission_id" => 3, "name" => 'Can edit invoice', "slug" => 'CAN_EDIT_INVOICE', "description" => 'Can edit invoice', "created_at" => Time::now()],
            ["permission_id" => 3, "name" => 'Can delete invoice', "slug" => 'CAN_DELETE_INVOICE', "description" => 'Can delete invoice', "created_at" => Time::now()],
            ["permission_id" => 3, "name" => 'Can view invoice', "slug" => 'CAN_VIEW_INVOICE', "description" => 'Can view invoice', "created_at" => Time::now()],
            ["permission_id" => 3, "name" => 'Can download Invoice', "slug" => 'CAN_DOWNLOAD_INVOICE', "description" => 'Can download Invoice', "created_at" => Time::now()],
            ["permission_id" => 3, "name" => 'Can add Invoice attachment', "slug" => 'CAN_ADD_INVOICE_ATTACHMENT', "description" => 'Can add Invoice attachment', "created_at" => Time::now()],
            ["permission_id" => 3, "name" => 'Can delete invoice attachment', "slug" => 'CAN_DELETE_INVOICE_ATTACHMENT', "description" => 'Can delete invoice attachment', "created_at" => Time::now()],
            ["permission_id" => 3, "name" => 'Can download invoice attachment', "slug" => 'CAN_DOWNLOAD_INVOICE_ATTACHMENT', "description" => 'Can download invoice attachment', "created_at" => Time::now()],
            ["permission_id" => 3, "name" => 'Can download invoice all attachment', "slug" => 'CAN_DOWNLOAD_INVOICE_ALL_ATTACHMENT', "description" => 'Can download invoice attachment', "created_at" => Time::now()],

            # Client - 4
            ["permission_id" => 4, "name" => 'Can add client', "slug" => 'CAN_ADD_CLIENT', "description" => 'Can add client', "created_at" => Time::now()],
            ["permission_id" => 4, "name" => 'Can edit client', "slug" => 'CAN_EDIT_CLIENT', "description" => 'Can edit client', "created_at" => Time::now()],
            ["permission_id" => 4, "name" => 'Can delete client', "slug" => 'CAN_DELETE_CLIENT', "description" => 'Can delete client', "created_at" => Time::now()],

            # Company - 5
            ["permission_id" => 5, "name" => 'Can add company', "slug" => 'CAN_ADD_COMPANY', "description" => 'Can add company', "created_at" => Time::now()],
            ["permission_id" => 5, "name" => 'Can edit company', "slug" => 'CAN_EDIT_COMPANY', "description" => 'Can edit company', "created_at" => Time::now()],
            ["permission_id" => 5, "name" => 'Can delete company', "slug" => 'CAN_DELETE_COMPANY', "description" => 'Can delete company', "created_at" => Time::now()],
            ["permission_id" => 5, "name" => 'Can change company setting', "slug" => 'CAN_COMPANY_SETTING', "description" => 'Can change company setting', "created_at" => Time::now()],
            ["permission_id" => 5, "name" => 'Can change company email configuration', "slug" => 'CAN_COMPANY_EMAIL_CONFIGURATION', "description" => 'Can change company email cofiguration', "created_at" => Time::now()],

            # Contribution - 6

            # Expenses - 7
            ["permission_id" => 7, "name" => 'Can Add Expenses', "slug" => 'CAN_ADD_EXPENSES', "description" => 'Can Add Expenses', "created_at" => Time::now()],
            ["permission_id" => 7, "name" => 'Can Edit Expenses', "slug" => 'CAN_EDIT_EXPENSES', "description" => 'Can Edit Expenses', "created_at" => Time::now()],
            ["permission_id" => 7, "name" => 'Can Delete Expenses', "slug" => 'CAN_DELETE_EXPENSES', "description" => 'Can Delete Expenses', "created_at" => Time::now()],

            // Report
            # Profit Loss - 8

            # Income Statement - 9

            // Role & Permission
            # User - 10
            ["permission_id" => 10, "name" => 'Can Add User', "slug" => 'CAN_ADD_USER', "description" => 'Can Add User', "created_at" => Time::now()],
            ["permission_id" => 10, "name" => 'Can Add User', "slug" => 'CAN_EDIT_USER', "description" => 'Can Add User', "created_at" => Time::now()],
            ["permission_id" => 10, "name" => 'Can Add User', "slug" => 'CAN_DELETE_USER', "description" => 'Can Add User', "created_at" => Time::now()],

            # Role - 11
            ["permission_id" => 11, "name" => 'Can add role', "slug" => 'CAN_ADD_ROLE', "description" => 'Can add role', "created_at" => Time::now()],
            ["permission_id" => 11, "name" => 'Can edit role', "slug" => 'CAN_EDIT_ROLE', "description" => 'Can edit role', "created_at" => Time::now()],
            ["permission_id" => 11, "name" => 'Can delete role', "slug" => 'CAN_DELETE_ROLE', "description" => 'Can delete role', "created_at" => Time::now()],

            # Permission List - 12

            # Permission Group - 13
            ["permission_id" => 13, "name" => 'Can add permission group', "slug" => 'CAN_ADD_PERMISSION_GROUP', "description" => 'Can add permission group', "created_at" => Time::now()],
            ["permission_id" => 13, "name" => 'Can edit Permission group', "slug" => 'CAN_EDIT_PERMISSION_GROUP', "description" => 'Can edit permission group', "created_at" => Time::now()],
            ["permission_id" => 13, "name" => 'Can delete permission group', "slug" => 'CAN_DELETE_PERMISSION_GROUP', "description" => 'Can delete permission group', "created_at" => Time::now()],

            # Restriction - 14

            // Setting
            # Country - 15
            ["permission_id" => 15, "name" => 'Can Add Country', "slug" => 'CAN_ADD_COUNTRY', "description" => 'Can Add Country', "created_at" => Time::now()],
            ["permission_id" => 15, "name" => 'Can Edit Country', "slug" => 'CAN_EDIT_COUNTRY', "description" => 'Can Edit Country', "created_at" => Time::now()],
            ["permission_id" => 15, "name" => 'Can Delete Country', "slug" => 'CAN_DELETE_COUNTRY', "description" => 'Can Delete Country', "created_at" => Time::now()],

            # Currency - 16
            ["permission_id" => 16, "name" => 'Can Add Currency', "slug" => 'CAN_ADD_CURRENCY', "description" => 'Can Add Currency', "created_at" => Time::now()],
            ["permission_id" => 16, "name" => 'Can Edit Currency', "slug" => 'CAN_EDIT_CURRENCY', "description" => 'Can Edit Currency', "created_at" => Time::now()],
            ["permission_id" => 16, "name" => 'Can Delete Currency', "slug" => 'CAN_DELETE_CURRENCY', "description" => 'Can Delete Currency', "created_at" => Time::now()],

            # Country Tax - 17
            ["permission_id" => 17, "name" => 'Can Add Country Tax', "slug" => 'CAN_ADD_COUNTRY_TAX', "description" => 'Can Add Country Tax', "created_at" => Time::now()],
            ["permission_id" => 17, "name" => 'Can Edit Country Tax', "slug" => 'CAN_EDIT_COUNTRY_TAX', "description" => 'Can Edit Country Tax', "created_at" => Time::now()],
            ["permission_id" => 17, "name" => 'Can Delete Country Tax', "slug" => 'CAN_DELETE_COUNTRY_TAX', "description" => 'Can Delete Country Tax', "created_at" => Time::now()],

            # Client Group - 18
            ["permission_id" => 18, "name" => 'Can Add Client Group', "slug" => 'CAN_ADD_CLIENT_GROUP', "description" => 'Can Add Client Group', "created_at" => Time::now()],
            ["permission_id" => 18, "name" => 'Can Edit Client Group', "slug" => 'CAN_EDIT_CLIENT_GROUP', "description" => 'Can Edit Client Group', "created_at" => Time::now()],
            ["permission_id" => 18, "name" => 'Can Delete Client Group', "slug" => 'CAN_DELETE_CLIENT_GROUP', "description" => 'Can Delete Client Group', "created_at" => Time::now()],

            # Source Platform - 19
            ["permission_id" => 19, "name" => 'Can Add Source Platform', "slug" => 'CAN_ADD_SOURCE_PLATFORM', "description" => 'Can Add Source Platform', "created_at" => Time::now()],
            ["permission_id" => 19, "name" => 'Can Edit Source Platform', "slug" => 'CAN_EDIT_SOURCE_PLATFORM', "description" => 'Can Edit Source Platform', "created_at" => Time::now()],
            ["permission_id" => 19, "name" => 'Can Delete Source Platform', "slug" => 'CAN_DELETE_SOURCE_PLATFORM', "description" => 'Can Delete Source Platform', "created_at" => Time::now()],

            # Company Financial Year - 20
            ["permission_id" => 20, "name" => 'Can Add Company Financial Year', "slug" => 'CAN_ADD_COMPANY_FINANCIAL_YEAR', "description" => 'Can Add Company Financial Year', "created_at" => Time::now()],
            ["permission_id" => 20, "name" => 'Can Edit Company Financial Year', "slug" => 'CAN_EDIT_COMPANY_FINANCIAL_YEAR', "description" => 'Can Edit Company Financial Year', "created_at" => Time::now()],
            ["permission_id" => 20, "name" => 'Can Delete Company Financial Year', "slug" => 'CAN_DELETE_COMPANY_FINANCIAL_YEAR', "description" => 'Can Delete Company Financial Year', "created_at" => Time::now()],

            # Invoice Terms - 21
            ["permission_id" => 21, "name" => 'Can add Terms', "slug" => 'CAN_ADD_TERMS', "description" => 'Can add Terms', "created_at" => Time::now()],
            ["permission_id" => 21, "name" => 'Can Edit Terms', "slug" => 'CAN_EDIT_TERMS', "description" => 'Can Edit Terms', "created_at" => Time::now()],
            ["permission_id" => 21, "name" => 'Can Delete Terms', "slug" => 'CAN_DELETE_TERMS', "description" => 'Can Delete Terms', "created_at" => Time::now()],

            # Invoice Item Type - 22
            ["permission_id" => 22, "name" => 'Can Add Invoice Item Type', "slug" => 'CAN_ADD_INVOICE_ITEM_TYPE', "description" => 'Can Add Invoice Item Type', "created_at" => Time::now()],
            ["permission_id" => 22, "name" => 'Can Edit Invoice Item Type', "slug" => 'CAN_EDIT_INVOICE_ITEM_TYPE', "description" => 'Can Edit Invoice Item Type', "created_at" => Time::now()],
            ["permission_id" => 22, "name" => 'Can Delete Invoice Item Type', "slug" => 'CAN_DELETE_INVOICE_ITEM_TYPE', "description" => 'Can Delete Invoice Item Type', "created_at" => Time::now()],

            # Payment Source - 23
            ["permission_id" => 23, "name" => 'Can Add Payment Source', "slug" => 'CAN_ADD_PAYMENT_SOURCE', "description" => 'Can Add Payment Source', "created_at" => Time::now()],
            ["permission_id" => 23, "name" => 'Can Edit Payment Source', "slug" => 'CAN_EDIT_PAYMENT_SOURCE', "description" => 'Can Edit Payment Source', "created_at" => Time::now()],
            ["permission_id" => 23, "name" => 'Can Delete Payment Source', "slug" => 'CAN_DELETE_PAYMENT_SOURCE', "description" => 'Can Delete Payment Source', "created_at" => Time::now()],

            # Expense Category - 24
            ["permission_id" => 24, "name" => 'Can add Terms', "slug" => 'CAN_ADD_EXPENSE_CATEGORY', "description" => 'Can add Terms', "created_at" => Time::now()],
            ["permission_id" => 24, "name" => 'Can Edit Terms', "slug" => 'CAN_EDIT_EXPENSE_CATEGORY', "description" => 'Can Edit Terms', "created_at" => Time::now()],
            ["permission_id" => 24, "name" => 'Can Delete Terms', "slug" => 'CAN_DELETE_EXPENSE_CATEGORY', "description" => 'Can Delete Terms', "created_at" => Time::now()]

        ];

        $restriction = new Restriction();
        $restriction->insertBatch($defaultRestriction);
    }
}
