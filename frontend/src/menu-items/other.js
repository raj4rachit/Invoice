// assets
import { IconDashboard, IconGitFork, IconUsers } from '@tabler/icons';

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const menuItems = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/',
        icon: IconDashboard,
        isIcon: true,
        breadcrumbs: false
    },
    {
        id: 'subscriber',
        title: 'Subscriber',
        type: 'item',
        url: '/subscriber',
        icon: IconUsers,
        isIcon: true,
        breadcrumbs: true,
        target: false
    },
    {
        id: 'invoice',
        title: 'Invoice',
        type: 'item',
        url: '/invoice',
        icon: IconUsers,
        isIcon: true,
        breadcrumbs: true,
        target: false
    },
    {
        id: 'contribution',
        title: 'Contribution',
        type: 'item',
        url: '/contribution',
        icon: IconUsers,
        isIcon: true,
        breadcrumbs: true,
        target: false
    },
    {
        id: 'company',
        title: 'Company',
        type: 'item',
        url: '/company',
        icon: IconUsers,
        isIcon: true,
        breadcrumbs: true,
        target: false
    },
    {
        id: 'client',
        title: 'Client',
        type: 'item',
        url: '/client',
        icon: IconUsers,
        isIcon: true,
        breadcrumbs: true,
        target: false
    },
    {
        id: 'income',
        title: 'Incomes',
        type: 'item',
        url: '/income',
        icon: IconUsers,
        isIcon: true,
        breadcrumbs: true,
        target: false
    },
    {
        id: 'expenses',
        title: 'Expenses',
        type: 'item',
        url: '/expenses',
        icon: IconUsers,
        isIcon: true,
        breadcrumbs: true,
        target: false
    },
    // {
    //     id: 'user',
    //     title: 'User',
    //     type: 'item',
    //     url: '/user',
    //     icon: IconUsers,
    //     isIcon: true,
    //     breadcrumbs: true,
    //     target: false
    // },
    {
        id: 'reports',
        title: 'Reports',
        type: 'collapse',
        icon: IconGitFork,
        isIcon: true,
        children: [
            {
                id: 'profit-loss',
                title: 'Profit Loss',
                type: 'item',
                url: '/reports/profit-loss',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'income-statement',
                title: 'Income Statement',
                type: 'item',
                url: '/reports/income-statement',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'expense-statement',
                title: 'Expense Statement',
                type: 'item',
                url: '/reports/expense-statement',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'yoy-report',
                title: 'YoY Report',
                type: 'item',
                url: '/reports/yoy-report',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'client-report',
                title: 'Client Report',
                type: 'item',
                url: '/reports/client-report',
                breadcrumbs: true,
                isIcon: false,
                target: false
            }
        ]
    },
    {
        id: 'role-permission',
        title: 'Role & Permission',
        type: 'collapse',
        icon: IconGitFork,
        isIcon: true,
        children: [
            {
                id: 'user',
                title: 'User',
                type: 'item',
                url: '/role-permission/user',
                // icon: IconUsers,
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'role',
                title: 'Role',
                type: 'item',
                url: '/role-permission/role',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'permission',
                title: 'Permission',
                type: 'collapse',
                icon: IconGitFork,
                isIcon: true,
                children: [
                    {
                        id: 'permission-list',
                        title: 'Permission List',
                        type: 'item',
                        url: '/role-permission/permission/permission-list',
                        breadcrumbs: true,
                        isIcon: false,
                        target: false
                    },
                    {
                        id: 'permission-group',
                        title: 'Permission Group',
                        type: 'item',
                        url: '/role-permission/permission/permission-group',
                        breadcrumbs: true,
                        isIcon: false,
                        target: false
                    }
                ]
            },
            {
                id: 'restriction',
                title: 'Restriction',
                type: 'item',
                isIcon: false,
                url: '/role-permission/restriction',
                breadcrumbs: true,
                target: false
            }
        ]
    },
    {
        id: 'settings',
        title: 'Settings',
        type: 'collapse',
        icon: IconGitFork,
        isIcon: true,
        children: [
            {
                id: 'country',
                title: 'Country',
                type: 'item',
                url: '/settings/country',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'currency',
                title: 'Currency',
                type: 'item',
                url: '/settings/currency',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'country-tax',
                title: 'Country Tax',
                type: 'item',
                url: '/settings/country-tax',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'payment-source',
                title: 'Payment Source',
                type: 'item',
                url: '/settings/payment-source',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'invoice-item-type',
                title: 'Invoice Item Type',
                type: 'item',
                url: '/settings/invoice-item-type',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'source-platform',
                title: 'Source Platform',
                type: 'item',
                url: '/settings/source-platform',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'client-group',
                title: 'Client Group',
                type: 'item',
                url: '/settings/client-group',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'company-financial-year',
                title: 'Company Financial Year',
                type: 'item',
                url: '/settings/company-financial-year',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'company-bank-details',
                title: 'Company Bank Details',
                type: 'item',
                url: '/settings/company-bank-details',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'invoice-terms',
                title: 'Invoice Terms',
                type: 'item',
                url: '/settings/invoice-terms',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'contribution-ratio',
                title: 'Contribution Ratio',
                type: 'item',
                url: '/settings/contribution-ratio',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'income-category',
                title: 'Income Category',
                type: 'item',
                url: '/settings/income-category',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'expense-category',
                title: 'Expense Category',
                type: 'item',
                url: '/settings/expense-category',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'document-type',
                title: 'Document Type',
                type: 'item',
                url: '/settings/document-type',
                breadcrumbs: true,
                isIcon: false,
                target: false
            },
            {
                id: 'contributor',
                title: 'Contributor',
                type: 'item',
                url: '/settings/contributor',
                breadcrumbs: true,
                isIcon: false,
                target: false
            }
        ]
    }
];

const other = {
    id: 'main-menu',
    type: 'group',
    children: menuItems
};

export default other;
