import * as actionTypes from './actions';

export const initialState = {
    selectedItem: 'dashboard',
    isChild: false,
    opened: true,
    selectedCollapse: [],
    permissions: [
        'dashboard',
        'profile',
        'subscriber',
        'invoice',
        'contribution',
        'company',
        'client',
        'income',
        'expenses',
        'profit-loss',
        'income-statement',
        'expense-statement',
        'yoy-report',
        'user',
        'role',
        'permission-list',
        'permission-group',
        'restriction',
        'country',
        'currency',
        'country-tax',
        'payment-source',
        'invoice-item-type',
        'source-platform',
        'client-group',
        'company-financial-year',
        'invoice-terms',
        'income-category',
        'expense-category',
        'contribution-ratio',
        'company-bank-details',
        'document-type'
    ]
};

const menuReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SELECTED_ITEM:
            return {
                ...state,
                selectedItem: action.selectedItem
            };
        case actionTypes.OPEN_DRAWER:
            return {
                ...state,
                opened: action.opened
            };
        case actionTypes.SELECTED_COLLAPSE:
            return {
                ...state,
                selectedCollapse: action.selectedCollapse
            };
        case actionTypes.DEFAULT_PERMISSION:
            return {
                ...state,
                permissions: action.permissions
            };
        default:
            return state;
    }
};

export default menuReducer;
