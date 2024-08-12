<?php

/*
 | --------------------------------------------------------------------
 | App Namespace
 | --------------------------------------------------------------------
 |
 | This defines the default Namespace that is used throughout
 | CodeIgniter to refer to the Application directory. Change
 | this constant to change the namespace that all application
 | classes should use.
 |
 | NOTE: changing this will require manually modifying the
 | existing namespaces of App\* namespaced-classes.
 */
defined('APP_NAMESPACE') || define('APP_NAMESPACE', 'App');

/*
 | --------------------------------------------------------------------------
 | Composer Path
 | --------------------------------------------------------------------------
 |
 | The path that Composer's autoload file is expected to live. By default,
 | the vendor folder is in the Root directory, but you can customize that here.
 */
defined('COMPOSER_PATH') || define('COMPOSER_PATH', ROOTPATH . 'vendor/autoload.php');

/*
 |--------------------------------------------------------------------------
 | Timing Constants
 |--------------------------------------------------------------------------
 |
 | Provide simple ways to work with the myriad of PHP functions that
 | require information to be in seconds.
 */
defined('SECOND') || define('SECOND', 1);
defined('MINUTE') || define('MINUTE', 60);
defined('HOUR')   || define('HOUR', 3600);
defined('DAY')    || define('DAY', 86400);
defined('WEEK')   || define('WEEK', 604800);
defined('MONTH')  || define('MONTH', 2_592_000);
defined('YEAR')   || define('YEAR', 31_536_000);
defined('DECADE') || define('DECADE', 315_360_000);

/*
 | --------------------------------------------------------------------------
 | Exit Status Codes
 | --------------------------------------------------------------------------
 |
 | Used to indicate the conditions under which the script is exit()ing.
 | While there is no universal standard for error codes, there are some
 | broad conventions.  Three such conventions are mentioned below, for
 | those who wish to make use of them.  The CodeIgniter defaults were
 | chosen for the least overlap with these conventions, while still
 | leaving room for others to be defined in future versions and user
 | applications.
 |
 | The three main conventions used for determining exit status codes
 | are as follows:
 |
 |    Standard C/C++ Library (stdlibc):
 |       http://www.gnu.org/software/libc/manual/html_node/Exit-Status.html
 |       (This link also contains other GNU-specific conventions)
 |    BSD sysexits.h:
 |       http://www.gsp.com/cgi-bin/man.cgi?section=3&topic=sysexits
 |    Bash scripting:
 |       http://tldp.org/LDP/abs/html/exitcodes.html
 |
 */
defined('EXIT_SUCCESS')        || define('EXIT_SUCCESS', 0); // no errors
defined('EXIT_ERROR')          || define('EXIT_ERROR', 1); // generic error
defined('EXIT_CONFIG')         || define('EXIT_CONFIG', 3); // configuration error
defined('EXIT_UNKNOWN_FILE')   || define('EXIT_UNKNOWN_FILE', 4); // file not found
defined('EXIT_UNKNOWN_CLASS')  || define('EXIT_UNKNOWN_CLASS', 5); // unknown class
defined('EXIT_UNKNOWN_METHOD') || define('EXIT_UNKNOWN_METHOD', 6); // unknown class member
defined('EXIT_USER_INPUT')     || define('EXIT_USER_INPUT', 7); // invalid user input
defined('EXIT_DATABASE')       || define('EXIT_DATABASE', 8); // database error
defined('EXIT__AUTO_MIN')      || define('EXIT__AUTO_MIN', 9); // lowest automatically-assigned error code
defined('EXIT__AUTO_MAX')      || define('EXIT__AUTO_MAX', 125); // highest automatically-assigned error code

/**
 * @deprecated Use \CodeIgniter\Events\Events::PRIORITY_LOW instead.
 */
define('EVENT_PRIORITY_LOW', 200);

/**
 * @deprecated Use \CodeIgniter\Events\Events::PRIORITY_NORMAL instead.
 */
define('EVENT_PRIORITY_NORMAL', 100);

/**
 * @deprecated Use \CodeIgniter\Events\Events::PRIORITY_HIGH instead.
 */
define('EVENT_PRIORITY_HIGH', 10);

// ================================== Custom Constants ================================== //

define('SUCCESS_ST', 1);
define('VALIDATION_ST', 0);
define('ERROR_ST', 0);

define('SOMETHING_WRONG', "Something wan't to wrong please try again!");
define('ACCESS_DENIED_MSG', "You do not have permission to access this data!");
define('INVALID_USER', 'User is invalid.');
// Authentication
define('INVALID_TOKEN_MSG', 'Token is invalid!');

// Auth
define('LOGOUT_SUCCESS', 'Logout has been successfully.');
define('TOKEN_NOT_FOUND', 'User token is not valid.');
define('REGISTER_SUCCESS', 'User has been registered successfully.');
define('EMAIL_SEND', 'Email sent on your registered email address.');

// Profile
define('CHANGE_PASSWORD_SUCCESS', 'Password has been changed successfully.');
define('CURRENT_PASSWORD_NOT_MATCH', 'Current password not match.');

// Role
global $roleStatus, $discountType, $dateFormat, $currencyLocale;
$roleStatus = [['label' => 'Active'], ['label' => 'Inactive']];
// Currency Locale List
$currencyLocale = [
    'au_AU', 'de_DE', 'en_AU', 'en-CA', 'en_GB', 'en-IE', 'en_IN', 'en-NZ', 'en_US', 'fr-FR', 'ja_JP', 'nl-NL', 'zh-HK', 'zh-SG', 'da-DK'
];
// Invoice Discount Type
$discountType = [
    ['id' => 'AFTER_TAX_PR',  'name' => 'Discount After Tax (%)'],
    ['id' => 'BEFORE_TAX_PR', 'name' => 'Discount Before Tax (%)'],
    ['id' => 'AFTER_TAX_FLAT', 'name' => 'Discount After Tax (Flat)'],
    ['id' => 'BEFORE_TAX_FLAT', 'name' => 'Discount Before Tax (Flat)'],
];
//Invoice prefix date format list
$dateFormat = [
    ['value' => "d-M", 'label' => date('d-M')],
    ['value' => "M", 'label' => date('M')],
    ['value' => "F", 'label' => date('F')]
];

$paymentStatus = ['Bad Debt', 'Due', 'Over Due', 'Paid', 'Partial', 'Unpaid'];

define('ADD_ROLE', 'Role has been added successfully.');
define('UPDATE_ROLE', 'Role has been updated successfully.');
define('DELETE_ROLE', 'Role has been deleted successfully.');
define('ROLE_NOT_FOUND', 'Role not found please try again.');

// Permission Group
define('ADD_PERMISSION_GROUP', 'Permission group has been added successfully.');
define('UPDATE_PERMISSION_GROUP', 'Permission group has been updated successfully.');
define('DELETE_PERMISSION_GROUP', 'Permission group has been deleted successfully.');
define('PERMISSION_GROUP_NOT_FOUND', 'Permission group not found please try again.');

// Restriction
define('ADD_RESTRICTION', 'Restriction has been added successfully.');
define('UPDATE_RESTRICTION', 'Restriction has been updated successfully.');
define('DELETE_RESTRICTION', 'Restriction has been deleted successfully.');
define('RESTRICTION_NOT_FOUND', 'Restriction not found please try again.');

// User
define('ADD_USER', 'User has been added successfully.');
define('UPDATE_USER', 'User has been updated successfully.');
define('DELETE_USER', 'User has been deleted successfully.');
define('USER_NOT_FOUND', 'User not found please try again.');

// User
define('ADD_SUBSCRIBER', 'Subscriber has been added successfully.');
define('UPDATE_SUBSCRIBER', 'Subscriber has been updated successfully.');
define('DELETE_SUBSCRIBER', 'Subscriber has been deleted successfully.');
define('SUBSCRIBER_NOT_FOUND', 'Subscriber not found please try again.');

// Status Master
define('ADD_COUNTRY', 'Country has been added successfully.');
define('UPDATE_COUNTRY', 'Country has been updated successfully.');
define('DELETE_COUNTRY', 'Country has been deleted successfully.');
define('COUNTRY_NOT_FOUND', 'Country not found please try again.');

define('ADD_TAX', 'Tax has been added successfully.');
define('UPDATE_TAX', 'Tax has been updated successfully.');
define('DELETE_TAX', 'Tax has been deleted successfully.');
define('TAX_NOT_FOUND', 'Tax not found please try again.');

define('ADD_CURRENCY', 'Currency has been added successfully.');
define('UPDATE_CURRENCY', 'Currency has been updated successfully.');
define('DELETE_CURRENCY', 'Currency has been deleted successfully.');
define('CURRENCY_NOT_FOUND', 'Currency not found please try again.');

define('ADD_PAYMENT_SOURCE', 'Payment source has been added successfully.');
define('UPDATE_PAYMENT_SOURCE', 'Payment source has been updated successfully.');
define('DELETE_PAYMENT_SOURCE', 'Payment source has been deleted successfully.');
define('PAYMENT_SOURCE_NOT_FOUND', 'Payment source not found please try again.');

define('ADD_ITEM_TYPE', 'Invoice item type has been added successfully.');
define('UPDATE_ITEM_TYPE', 'Invoice item type has been updated successfully.');
define('DELETE_ITEM_TYPE', 'Invoice item type has been deleted successfully.');
define('ITEM_TYPE_NOT_FOUND', 'Invoice item type not found please try again.');

define('ADD_SOURCE_PLATFORM', 'Source platform has been added successfully.');
define('UPDATE_SOURCE_PLATFORM', 'Source platform has been updated successfully.');
define('DELETE_SOURCE_PLATFORM', 'Source platform has been deleted successfully.');
define('SOURCE_PLATFORM_NOT_FOUND', 'Source platform not found please try again.');

define('ADD_CLIENT_GROUP', 'Client group has been added successfully.');
define('UPDATE_CLIENT_GROUP', 'Client group has been updated successfully.');
define('DELETE_CLIENT_GROUP', 'Client group has been deleted successfully.');
define('CLIENT_GROUP_NOT_FOUND', 'Client group not found please try again.');

define('ADD_CLIENT', 'Client has been added successfully.');
define('UPDATE_CLIENT', 'Client has been updated successfully.');
define('DELETE_CLIENT', 'Client has been deleted successfully.');
define('CLIENT_NOT_FOUND', 'Client not found please try again.');

define('ADD_CONTRIBUTOR', 'Contributor has been added successfully.');
define('UPDATE_CONTRIBUTOR', 'Contributor has been updated successfully.');
define('DELETE_CONTRIBUTOR', 'Contributor has been deleted successfully.');
define('CONTRIBUTOR_NOT_FOUND', 'Contributor not found please try again.');

define('ADD_COMPANY_BANK', 'Company bank been added successfully.');
define('UPDATE_COMPANY_BANK', 'Company bank has been updated successfully.');
define('DELETE_COMPANY_BANK', 'Company bank has been deleted successfully.');
define('COMPANY_BANK_NOT_FOUND', 'Company bank not found please try again.');


define('ADD_INCOMES', 'Income has been added successfully.');
define('UPDATE_INCOMES', 'Income has been updated successfully.');
define('DELETE_INCOMES', 'Income has been deleted successfully.');
define('INCOMES_NOT_FOUND', 'Income not found please try again.');


define('ADD_EXPENSES', 'Expenses has been added successfully.');
define('UPDATE_EXPENSES', 'Expenses has been updated successfully.');
define('DELETE_EXPENSES', 'Expenses has been deleted successfully.');
define('EXPENSES_NOT_FOUND', 'Expenses not found please try again.');

define('ADD_COMPANY', 'Company has been added successfully.');
define('UPDATE_COMPANY', 'Company has been updated successfully.');
define('DELETE_COMPANY', 'Company has been deleted successfully.');
define('COMPANY_NOT_FOUND', 'Company not found please try again.');

define('ADD_COMPANY_FINANCIAL_YEAR', 'Company financial year has been added successfully.');
define('UPDATE_COMPANY_FINANCIAL_YEAR', 'Company financial year has been updated successfully.');
define('DELETE_COMPANY_FINANCIAL_YEAR', 'Company financial year has been deleted successfully.');
define('COMPANY_FINANCIAL_YEAR_NOT_FOUND', 'Company financial year not found please try again.');

define('ADD_COMPANY_SETTING', 'Company setting has been added successfully.');
define('UPDATE_COMPANY_SETTING', 'Company setting has been updated successfully.');
define('COMPANY_SETTING_NOT_FOUND', 'Company setting not found please try again.');

define('ADD_INVOICE', 'Invoice has been added successfully.');
define('UPDATE_INVOICE', 'Invoice has been updated successfully.');
define('DELETE_INVOICE', 'Invoice has been deleted successfully.');
define('INVOICE_NOT_FOUND', 'Invoice not found please try again.');

define('ADD_EMAILCONFIG', 'E-Mail configuration has been added successfully.');
define('UPDATE_EMAILCONFIG', 'E-Mail configuration has been updated successfully.');

define('ADD_PAYMENT_TERM', 'Payment term has been added successfully.');
define('UPDATE_PAYMENT_TERM', 'Payment term has been updated successfully.');
define('DELETE_PAYMENT_TERM', 'Payment term has been deleted successfully.');
define('PAYMENT_TERM_NOT_FOUND', 'Payment term not found please try again.');

define('ADD_ATTACHMENT', 'Invoice attachment has been added successfully.');
define('DELETE_ATTACHMENT', 'Invoice attachment has been deleted successfully.');
define('ATTACHMENT_NOT_FOUND', 'Invoice attachment not found please try again.');

define("ADD_INVOICE_PAYMENT", "Invoice payment has been added successfully.");
define("UPDATE_INVOICE_PAYMENT", "Invoice payment has been updated successfully.");
define("DELETE_INVOICE_PAYMENT", "Invoice payment has been deleted successfully.");
define("INVOICE_PAYMENT_NOT_FOUND", "Invoice payment not found try again.");

define('ADD_CONTRIBUTION_RATIO', 'Contribution ratio has been added successfully.');
define('UPDATE_CONTRIBUTION_RATIO', 'Contribution ratio has been updated successfully.');
define('DELETE_CONTRIBUTION_RATIO', 'Contribution ratio has been deleted successfully.');
define('CONTRIBUTION_RATIO_NOT_FOUND', 'Contribution ratio not found please try again.');

define('ADD_INCOME_CATEGORY', 'Income category has been added successfully.');
define('UPDATE_INCOME_CATEGORY', 'Income category has been updated successfully.');
define('DELETE_INCOME_CATEGORY', 'Income category has been deleted successfully.');
define('INCOME_CATEGORY_NOT_FOUND', 'Income category not found please try again.');

define('ADD_EXPENSE_CATEGORY', 'Expenses category has been added successfully.');
define('UPDATE_EXPENSE_CATEGORY', 'Expenses category has been updated successfully.');
define('DELETE_EXPENSE_CATEGORY', 'Expenses category has been deleted successfully.');
define('EXPENSE_CATEGORY_NOT_FOUND', 'Expenses category not found please try again.');

define('ADD_USER_CONTRIBUTION', 'User contribution has been added successfully.');
define('UPDATE_USER_CONTRIBUTION', 'User contribution has been updated successfully.');
define('DELETE_USER_CONTRIBUTION', 'User contribution has been deleted successfully.');
define('USER_CONTRIBUTION_NOT_FOUND', 'User contribution not found please try again.');

define('ADD_DOCUMENT_TYPE', 'Document type has been added successfully.');
define('UPDATE_DOCUMENT_TYPE', 'Document type has been updated successfully.');
define('DELETE_DOCUMENT_TYPE', 'Document type has been deleted successfully.');
define('DOCUMENT_TYPE_NOT_FOUND', 'Document type not found please try again.');
