<?php

namespace App\Database\Seeds;

use App\Models\Permission;
use CodeIgniter\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            #Main Menu
            ["name" => 'Dashboard', "slug" => 'dashboard', "url" => '/dashboard', "is_default" => 'Yes'],  #1
            ["name" => 'Subscriber', "slug" => 'subscriber', "url" => '/subscriber', "is_default" => 'No'],  #2
            ["name" => 'Invoice', "slug" => 'invoice', "url" => '/invoice', "is_default" => 'No'],  #3
            ["name" => 'Client', "slug" => 'client', "url" => '/client', "is_default" => 'No'],  #4
            ["name" => 'Company', "slug" => 'company', "url" => '/company', "is_default" => 'No'],  #5
            ["name" => 'Contribution', "slug" => 'contribution', "url" => '/contribution', "is_default" => 'No'],  #6
            ["name" => 'Expenses', "slug" => 'expenses', "url" => '/expenses', "is_default" => 'No'],  #7

            #Report Permission
            ["name" => 'Profit Loss Report', "slug" => 'profit-loss', "url" => '/reports/profit-loss', "is_default" => 'No'],  #8
            ["name" => 'Income Statement Report', "slug" => 'income-statement', "url" => '/reports/income-statement', "is_default" => 'No'],  #9

            # Role & Permission
            ["name" => 'User', "slug" => 'user', "url" => '/user', "is_default" => 'No'],  #10
            ["name" => 'Role', "slug" => 'role', "url" => '/role-permission/role', "is_default" => 'No'],  #11
            ["name" => 'Permission List', "slug" => 'permission-list', "url" => '/role-permission/permission/permission-list', "is_default" => 'No'],  #12
            ["name" => 'Permission Group', "slug" => 'permission-group', "url" => '/role-permission/permission/permission-group', "is_default" => 'No'],  #13
            ["name" => 'Restriction', "slug" => 'restriction', "url" => '/role-permission/restriction', "is_default" => 'No'],  #14

            #Setting Permission
            ["name" => 'Country', "slug" => 'country', "url" => '/settings/country', "is_default" => 'No'],  #15
            ["name" => 'Currency', "slug" => 'currency', "url" => '/settings/currency', "is_default" => 'No'],  #16
            ["name" => 'Country Tax', "slug" => 'country-tax', "url" => '/settings/country-tax', "is_default" => 'No'],  #17
            ["name" => 'Client Group', "slug" => 'client-group', "url" => '/settings/client-group', "is_default" => 'No'],  #18
            ["name" => 'Source Platform', "slug" => 'source-platform', "url" => '/settings/source-platform', "is_default" => 'No'],  #19
            ["name" => 'Company Financial Year', "slug" => 'company-financial-year', "url" => '/settings/company-financial-year', "is_default" => 'No'],  #20
            ["name" => 'Invoice Terms', "slug" => 'invoice-terms', "url" => '/settings/invoice-terms', "is_default" => 'No'],  #21
            ["name" => 'Invoice Item Type', "slug" => 'invoice-item-type', "url" => '/settings/invoice-item-type', "is_default" => 'No'],  #22
            ["name" => 'Payment Source', "slug" => 'payment-source', "url" => '/settings/payment-source', "is_default" => 'No'],  #23
            ["name" => 'Expense Category', "slug" => 'expense-category', "url" => '/settings/expense-category', "is_default" => 'No'],  #24
        ];

        $permission = new Permission();
        $permission->insertBatch($permissions);
    }
}

// Main Menu
# Dashboard - 1
# Subscriber - 2
# Invoice - 3
# Client - 4
# Company - 5
# Contribution - 6
# Expenses - 7

// Report
# Profit Loss - 8
# Income Statement - 9

// Role & Permission
# User - 10
# Role - 11
# Permission List - 12
# Permission Group - 13
# Restriction - 14

// Setting
# Country - 15
# Currency - 16
# Country Tax - 17
# Client Group - 18
# Source Platform - 19
# Company Financial Year - 20
# Invoice Terms - 21
# Invoice Item Type - 22
# Payment Source - 23
# Expense Category - 24
