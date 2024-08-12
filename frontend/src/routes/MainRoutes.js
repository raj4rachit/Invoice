import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Profile = Loadable(lazy(() => import('views/profile')));
const User = Loadable(lazy(() => import('views/user')));
const Subscriber = Loadable(lazy(() => import('views/subscriber')));
const Invoice = Loadable(lazy(() => import('views/invoice')));
const Contribution = Loadable(lazy(() => import('views/contribution')));
const Company = Loadable(lazy(() => import('views/company')));
const Client = Loadable(lazy(() => import('views/client')));
const Income = Loadable(lazy(() => import('views/income')));
const Expenses = Loadable(lazy(() => import('views/expenses')));
// Reports
const ProfitLoss = Loadable(lazy(() => import('views/reports/profitLoss/index')));
const IncomeStatement = Loadable(lazy(() => import('views/reports/incomeStatement/index')));
const ExpenseStatement = Loadable(lazy(() => import('views/reports/expenseStatement/index')));
const YOYReport = Loadable(lazy(() => import('views/reports/YoYReport/index')));
const ClientReport = Loadable(lazy(() => import('views/reports/clientReport/index')));
// Role and Permission
const Role = Loadable(lazy(() => import('views/role/index')));
const Permission = Loadable(lazy(() => import('views/permission/index')));
const PermissionGroup = Loadable(lazy(() => import('views/permission/group/index')));
const Restriction = Loadable(lazy(() => import('views/restriction/index')));
// Settings
const Country = Loadable(lazy(() => import('views/settings/country/index')));
const Currency = Loadable(lazy(() => import('views/settings/currency/index')));
const CountryTax = Loadable(lazy(() => import('views/settings/countryTax/index')));
const PaymentSource = Loadable(lazy(() => import('views/settings/paymentSource/index')));
const InvoiceItemType = Loadable(lazy(() => import('views/settings/invoiceItemType/index')));
const SourcePlatform = Loadable(lazy(() => import('views/settings/sourcePlatform/index')));
const ClientGroup = Loadable(lazy(() => import('views/settings/clientGroup/index')));
const CompanyFinancialYear = Loadable(lazy(() => import('views/settings/companyFinancialYear/index')));
const CompanyBankDetails = Loadable(lazy(() => import('views/settings/companyBankDetails/index')));
const InvoiceTerms = Loadable(lazy(() => import('views/settings/invoiceTerms/index')));
const ContributionRatio = Loadable(lazy(() => import('views/settings/contributionRatio/index')));
const IncomeCategory = Loadable(lazy(() => import('views/settings/incomeCategory/index')));
const ExpenseCategory = Loadable(lazy(() => import('views/settings/expenseCategory/index')));
const DocumentType = Loadable(lazy(() => import('views/settings/documentType/index')));
const Contributor = Loadable(lazy(() => import('views/settings/contributor/index')));
// ==============================|| MAIN ROUTING ||============================== //

const routeItems = [
    {
        id: 'dashboard',
        path: '/',
        element: <DashboardDefault />
    },
    {
        id: 'profile',
        path: '/profile',
        element: <Profile />
    },
    {
        id: 'subscriber',
        path: 'subscriber',
        element: <Subscriber />
    },
    {
        id: 'invoice',
        path: 'invoice',
        element: <Invoice />
    },
    {
        id: 'contribution',
        path: 'contribution',
        element: <Contribution />
    },
    {
        id: 'company',
        path: 'company',
        element: <Company />
    },
    {
        id: 'client',
        path: 'client',
        element: <Client />
    },
    {
        id: 'income',
        path: 'income',
        element: <Income />
    },
    {
        id: 'expenses',
        path: 'expenses',
        element: <Expenses />
    },
    {
        id: 'reports',
        path: 'reports',
        children: [
            {
                id: 'profit-loss',
                path: 'profit-loss',
                element: <ProfitLoss />
            },
            {
                id: 'income-statement',
                path: 'income-statement',
                element: <IncomeStatement />
            },
            {
                id: 'expense-statement',
                path: 'expense-statement',
                element: <ExpenseStatement />
            },
            {
                id: 'yoy-report',
                path: 'yoy-report',
                element: <YOYReport />
            },
            {
                id: 'client-report',
                path: 'client-report',
                element: <ClientReport />
            }
        ]
    },
    {
        id: 'role-permission',
        path: 'role-permission',
        children: [
            {
                id: 'user',
                path: 'user',
                element: <User />
            },
            {
                id: 'role',
                path: 'role',
                element: <Role />
            },
            {
                id: 'permission',
                path: 'permission',
                children: [
                    {
                        id: 'permission-list',
                        path: 'permission-list',
                        element: <Permission />
                    },
                    {
                        id: 'permission-group',
                        path: 'permission-group',
                        element: <PermissionGroup />
                    }
                ]
            },
            {
                id: 'restriction',
                path: 'restriction',
                element: <Restriction />
            }
        ]
    },
    {
        id: 'settings',
        path: 'settings',
        children: [
            {
                id: 'country',
                path: 'country',
                element: <Country />
            },
            {
                id: 'currency',
                path: 'currency',
                element: <Currency />
            },
            {
                id: 'country-tax',
                path: 'country-tax',
                element: <CountryTax />
            },
            {
                id: 'payment-source',
                path: 'payment-source',
                element: <PaymentSource />
            },
            {
                id: 'invoice-item-type',
                path: 'invoice-item-type',
                element: <InvoiceItemType />
            },
            {
                id: 'source-platform',
                path: 'source-platform',
                element: <SourcePlatform />
            },
            {
                id: 'client-group',
                path: 'client-group',
                element: <ClientGroup />
            },
            {
                id: 'company-financial-year',
                path: 'company-financial-year',
                element: <CompanyFinancialYear />
            },
            {
                id: 'company-bank-details',
                path: 'company-bank-details',
                element: <CompanyBankDetails />
            },
            {
                id: 'invoice-terms',
                path: 'invoice-terms',
                element: <InvoiceTerms />
            },
            {
                id: 'contribution-ratio',
                path: 'contribution-ratio',
                element: <ContributionRatio />
            },
            {
                id: 'income-category',
                path: 'income-category',
                element: <IncomeCategory />
            },
            {
                id: 'expense-category',
                path: 'expense-category',
                element: <ExpenseCategory />
            },
            {
                id: 'document-type',
                path: 'document-type',
                element: <DocumentType />
            },
            {
                id: 'contributor',
                path: 'contributor',
                element: <Contributor />
            }
        ]
    }
];

// function setPermission(elem) {
//     const permissionData = ['dashboard', 'profile', 'user', 'employer', 'role', 'permission-list', 'permission-group', 'restriction'];
//     return elem.filter((item) => (item.children ? (item.children = setPermission(item.children)) : permissionData.includes(item.id)));
// }

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: routeItems
};

export default MainRoutes;
