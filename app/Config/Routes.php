<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (is_file(SYSTEMPATH . 'Config/Routes.php')) {
    require SYSTEMPATH . 'Config/Routes.php';
}

/*
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
// The Auto Routing (Legacy) is very dangerous. It is easy to create vulnerable apps
// where controller filters or CSRF protection are bypassed.
// If you don't want to define all routes, please use the Auto Routing (Improved).
// Set `$autoRoutesImproved` to true in `app/Config/Feature.php` and set the following to true.
$routes->setAutoRoute(false);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
// $routes->get('/testingurl', 'Home::testingPost');
// $routes->post('/sort', 'Home::testingPost',['as' => 'sort']);

$routes->get('cal-amount', 'Home::reCalAmount');
$routes->get('sub-currency', 'Home::addSubscriberCurrencyInInvoice');
$routes->get('copy-category', 'Home::copyExpenseCategory');

$routes->group('api', function ($routes) {
    $routes->group('v1', ['filter' => 'auth', 'namespace' => 'App\Controllers\Api\v1'], function ($routes) {

        $routes->group('auth', ['namespace' => 'App\Controllers\Api\v1\Authentication'], function ($routes) {
            $routes->get('home123', 'AuthController::testing'); // For testing purpose
            $routes->get('/', 'AuthController::index');
            $routes->post('login', 'AuthController::checkLogin');
            $routes->post('forgot-password', 'AuthController::forgotPassword');
            $routes->post('reset-password', 'AuthController::resetPassword');
            $routes->post('logout', 'AuthController::logout', ['filter' => 'auth']);
            $routes->post('company-list', 'AuthController::companyList', ['filter' => 'auth']);
            $routes->post('financial-list', 'AuthController::companyFinancialYearList', ['filter' => 'auth']);
        });

        $routes->group('dashboard', function ($routes) {
            $routes->get('/', 'DashboardController::index');
            $routes->get('by-dates', 'DashboardController::CardDataByDates');
        });

        // $routes->group('role-permission', ['filter' => 'auth', 'namespace' => 'App\Controllers\Api\v1\Authentication'], function ($routes) {
        $routes->group('role-permission', ['namespace' => 'App\Controllers\Api\v1\Authentication'], function ($routes) {
            $routes->group('role', function ($routes) {
                $routes->get('list', 'RoleController::index');
                $routes->post('create', 'RoleController::create');
                $routes->post('update', 'RoleController::update');
                $routes->post('delete', 'RoleController::delete');
            });

            $routes->group('permission', function ($routes) {
                $routes->get('list', 'PermissionController::index');
                $routes->get('group-list', 'PermissionController::groupList');
                $routes->post('group-create', 'PermissionController::groupCreate');
                $routes->post('group-update', 'PermissionController::groupUpdate');
                $routes->post('group-delete', 'PermissionController::groupDelete');
                $routes->post('group-view', 'PermissionController::groupView');
            });

            // Restriction
            $routes->group('restriction', function ($routes) {
                $routes->get('list', 'RestrictionController::index');
                $routes->post('create', 'RestrictionController::create');
                $routes->post('update', 'RestrictionController::update');
                $routes->post('delete', 'RestrictionController::delete');
            });
        });

        // Country
        $routes->group('country', function ($routes) {
            $routes->get('list', 'CountryController::index');
            $routes->post('create', 'CountryController::create');
            $routes->post('update', 'CountryController::update');
        });

        // Company Bank
        $routes->group('company-bank', function ($routes) {
            $routes->get('list', 'CompanyBankController::index');
            $routes->post('create', 'CompanyBankController::create');
            $routes->post('update', 'CompanyBankController::update');
            $routes->post('delete', 'CompanyBankController::delete');
            $routes->post('view', 'CompanyBankController::view');
        });

        // Currency
        $routes->group('currency', function ($routes) {
            $routes->get('list', 'CurrencyController::index');
            $routes->post('create', 'CurrencyController::create');
            $routes->post('update', 'CurrencyController::update');
        });

        // Country Tax
        $routes->group('tax', function ($routes) {
            $routes->get('list', 'TaxController::index');
            $routes->post('create', 'TaxController::create');
            $routes->post('update', 'TaxController::update');
            $routes->post('delete', 'TaxController::delete');
        });

        // Payment Source
        $routes->group('payment-source', function ($routes) {
            $routes->get('list', 'PaymentSourceController::index');
            $routes->post('create', 'PaymentSourceController::create');
            $routes->post('update', 'PaymentSourceController::update');
            $routes->post('delete', 'PaymentSourceController::delete');
        });

        // Source Platform
        $routes->group('source-platform', function ($routes) {
            $routes->get('list', 'SourcePlatformController::index');
            $routes->post('create', 'SourcePlatformController::create');
            $routes->post('update', 'SourcePlatformController::update');
            $routes->post('delete', 'SourcePlatformController::delete');
        });

        // Invoice Item Type
        $routes->group('item-type', function ($routes) {
            $routes->get('list', 'InvoiceItemTypeController::index');
            $routes->post('create', 'InvoiceItemTypeController::create');
            $routes->post('update', 'InvoiceItemTypeController::update');
            $routes->post('delete', 'InvoiceItemTypeController::delete');
        });

        // Subscriber
        $routes->group('subscriber', function ($routes) {
            $routes->get('list', 'SubscriberController::index');
            $routes->post('create', 'SubscriberController::create');
            $routes->post('update', 'SubscriberController::update');
            $routes->post('delete', 'SubscriberController::delete');
        });

        // User
        $routes->group('user', function ($routes) {
            $routes->get('list', 'UserController::index');
            $routes->post('create', 'UserController::create');
            $routes->post('update', 'UserController::update');
            $routes->post('delete', 'UserController::delete');
        });

        // Profile
        $routes->group('profile', function ($routes) {
            $routes->post('change-password', 'UserController::changePassword');
        });

        $routes->group('client', function ($routes) {
            $routes->get('list', 'ClientController::index');
            $routes->post('create', 'ClientController::create');
            $routes->post('update', 'ClientController::update');
            $routes->post('delete', 'ClientController::delete');
            $routes->post('client-view', 'ClientController::clientView');
            $routes->get('client-lifetime-income', 'ClientController::getClientBill');

            $routes->get('group-list', 'ClientController::groupList');
            $routes->post('group-create', 'ClientController::groupCreate');
            $routes->post('group-update', 'ClientController::groupUpdate');
            $routes->post('group-delete', 'ClientController::groupDelete');
        });

        $routes->group('contributor', function ($routes) {
            $routes->get('list', 'ContributorController::index');
            $routes->post('create', 'ContributorController::create');
            $routes->post('update', 'ContributorController::update');
            $routes->post('delete', 'ContributorController::delete');
        });

        // Income
        $routes->group('incomes', function ($routes) {
            $routes->get('list', 'IncomeController::index');
            $routes->get('subcategory', 'IncomeController::getSubCategory');
            $routes->post('create', 'IncomeController::create');
            $routes->post('update', 'IncomeController::update');
            $routes->post('delete', 'IncomeController::delete');
        });

        $routes->group('expenses', function ($routes) {
            $routes->get('list', 'ExpensesController::index');
            $routes->get('subcategory', 'ExpensesController::getSubCategory');
            $routes->post('create', 'ExpensesController::create');
            $routes->post('update', 'ExpensesController::update');
            $routes->post('delete', 'ExpensesController::delete');
        });

        $routes->group('company', function ($routes) {
            $routes->get('list', 'CompanyController::index');
            $routes->post('create', 'CompanyController::create');
            $routes->post('update', 'CompanyController::update');
            $routes->post('company-view', 'CompanyController::companyView');
            $routes->post('delete', 'CompanyController::delete');
        });

        $routes->group('company-financial-year', function ($routes) {
            $routes->get('list', 'CompanyFinancialYearController::index');
            $routes->post('create', 'CompanyFinancialYearController::create');
            $routes->post('update', 'CompanyFinancialYearController::update');
            $routes->post('delete', 'CompanyFinancialYearController::delete');
        });

        $routes->group('invoice', function ($routes) {
            $routes->get('list', 'InvoiceController::index');
            $routes->get('currency-rate', 'InvoiceController::currencyRate');
            $routes->post('view', 'InvoiceController::view');
            $routes->post('create', 'InvoiceController::create');
            $routes->post('update', 'InvoiceController::update');
            $routes->post('delete', 'InvoiceController::delete');
            $routes->post('invoice-pdf', 'InvoiceController::downloadInvoicePDF');
            $routes->get('list-attachment', 'InvoiceController::attachmentList');
            $routes->post('add-attachment', 'InvoiceController::addAttachment');
            $routes->post('create-attachment', 'InvoiceController::attachmentCreate');
            $routes->post('create-attachment', 'InvoiceController::attachmentCreate');
            $routes->post('delete-attachment', 'InvoiceController::attachmentDelete');
            $routes->get('all-attachment', 'InvoiceController::downloadAttachmentList');
            $routes->get('duplicate-invoice', 'InvoiceController::duplicateInvoice');
        });

        $routes->group('invoice-payment', function ($routes) {
            $routes->get('list', 'PaymentStatusController::index');
            $routes->post('create', 'PaymentStatusController::create');
            $routes->post('update', 'PaymentStatusController::update');
            $routes->post('delete', 'PaymentStatusController::delete');
            $routes->post('init', 'PaymentStatusController::init');
        });

        $routes->group('payment-term', function ($routes) {
            $routes->get('list', 'PaymentTermController::index');
            $routes->post('create', 'PaymentTermController::create');
            $routes->post('update', 'PaymentTermController::update');
            $routes->post('delete', 'PaymentTermController::delete');
        });

        // Contribution
        $routes->group('contribution', function ($routes) {
            $routes->get('/', 'ContributionController::index');
            $routes->post('client-month', 'ContributionController::EmployeesClientData');
            $routes->post('employee-slab', 'ContributionController::EmployeeSlabs');
            $routes->post('create-update', 'ContributionController::createOrUpdate');
        });

        // Contribution Ratio
        $routes->group('contribution-ratio', function ($routes) {
            $routes->get('list', 'ContributionRatioController::index');
            $routes->post('create', 'ContributionRatioController::create');
            $routes->post('update', 'ContributionRatioController::update');
            $routes->post('delete', 'ContributionRatioController::delete');
        });

        // Income Category
        $routes->group('income-category', function ($routes) {
            $routes->get('list', 'IncomeCategoryController::index');
            $routes->post('create', 'IncomeCategoryController::create');
            $routes->post('update', 'IncomeCategoryController::update');
            $routes->post('delete', 'IncomeCategoryController::delete');
        });


        // Expense Category
        $routes->group('expense-category', function ($routes) {
            $routes->get('list', 'ExpenseCategoryController::index');
            $routes->post('create', 'ExpenseCategoryController::create');
            $routes->post('update', 'ExpenseCategoryController::update');
            $routes->post('delete', 'ExpenseCategoryController::delete');
        });

        // Expense Category
        $routes->group('document-type', function ($routes) {
            $routes->get('list', 'DocumentTypeController::index');
            $routes->post('create', 'DocumentTypeController::create');
            $routes->post('update', 'DocumentTypeController::update');
            $routes->post('delete', 'DocumentTypeController::delete');
        });

        $routes->group('company-setting', function ($routes) {
            $routes->post('create', 'CompanySettingController::create');
        });
        $routes->group('email-configration', function ($routes) {
            $routes->post('create', 'EmailConfigrationController::create');
        });

        // Reports
        $routes->group('reports', function ($routes) {
            $routes->get('init', 'ReportController::index');
            $routes->post('profit-loss', 'ReportController::profitLossReport');
            $routes->get('income-statement-init', 'ReportController::invoiceStatementInit');
            $routes->post('income-statement', 'ReportController::incomeStatementReport');
            $routes->post('expense-statement', 'ReportController::expenseStatementReport');
            $routes->post('yoy-report', 'ReportController::yoyReport');
            $routes->post('client-report', 'ReportController::clientReport');
            $routes->get('init-client', 'ReportController::clientList');
        });
    });
});

$routes->get('/(:any)', function () {
    return view('frontend');
});

/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */
if (is_file(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
    require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
