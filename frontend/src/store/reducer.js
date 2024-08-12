import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// reducer import
import customizationReducer from './customizationReducer';
import loaderReducer from './loaderReducer';
import menuReducer from './menuReducer';
import snackbarReducer from './snackbarReducer';
import accountReducer from './accountReducer';
import companyReducer from './companyReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    snackbar: snackbarReducer,
    menu: menuReducer,
    account: persistReducer(
        {
            key: 'Data',
            storage,
            keyPrefix: 'login'
        },
        accountReducer
    ),
    loader: loaderReducer,
    company: companyReducer
});

export default reducer;
