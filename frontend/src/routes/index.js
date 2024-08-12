import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import useAuth from 'hooks/useAuth';
import { useSelector } from 'react-redux';
import Loadable from 'ui-component/Loadable';
import { lazy } from 'react';

// elements
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
// ==============================|| ROUTING RENDER ||============================== //
// function setPermission(elem, permission) {
//     return elem.filter((item) =>
//         item.children ? (item.children = setPermission(item.children, permission)) : permission.includes(item.id)
//     );
// }

const routeElement = {
    dashboard: <DashboardDefault />,
    profile: <Profile />,
    subscriber: <Subscriber />,
    invoice: <Invoice />,
    contribution: <Contribution />,
    company: <Company />,
    client: <Client />,
    income: <Income />,
    expenses: <Expenses />,
    profitloss: <ProfitLoss />,
    incomestatement: <IncomeStatement />,
    expensestatement: <ExpenseStatement />,
    yoyreport: <YOYReport />,
    clientreport: <ClientReport />,
    user: <User />,
    role: <Role />,
    permissionlist: <Permission />,
    permissiongroup: <PermissionGroup />,
    restriction: <Restriction />,
    country: <Country />,
    currency: <Currency />,
    countrytax: <CountryTax />,
    paymentsource: <PaymentSource />,
    invoiceitemtype: <InvoiceItemType />,
    sourceplatform: <SourcePlatform />,
    clientgroup: <ClientGroup />,
    companyfinancialyear: <CompanyFinancialYear />,
    companybankdetails: <CompanyBankDetails />,
    invoiceterms: <InvoiceTerms />,
    contributionratio: <ContributionRatio />,
    incomecategory: <IncomeCategory />,
    expensecategory: <ExpenseCategory />,
    documenttype: <DocumentType />,
    contributor: <Contributor />
};

export default function ThemeRoutes() {
    const { access } = useAuth();
    const menuSelector = useSelector((state) => state.menu);
    const defaultPermissions = menuSelector.permissions;
    const extraPermission = ['profile'];
    const userPermission = access && access.permissions ? [...access.permissions, ...extraPermission] : defaultPermissions;
    function checkPermission(object) {
        return object.filter((item) => {
            if (item.children) {
                if (checkPermission(item.children).length != 0) {
                    return (item.children = checkPermission(item.children));
                }
            } else {
                return userPermission.includes(item.id);
            }
        });
    }

    const objMenuRoutes = JSON.parse(JSON.stringify(MainRoutes));

    function addElement(object) {
        return object.map((item) => {
            if (item.element) {
                item.element = routeElement[item.id.replace(/[-]/g, '')];
            }
            item.children && addElement(item.children);
        });
    }

    let routeByPermission = checkPermission(objMenuRoutes.children);
    addElement(objMenuRoutes.children);

    const NewMainRoutes = {
        path: MainRoutes.path,
        element: MainRoutes.element,
        children: routeByPermission
    };

    return useRoutes([NewMainRoutes, AuthenticationRoutes]);
}
