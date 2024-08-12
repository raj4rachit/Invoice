import { LOGIN, LOGOUT, CHANGE_COMPANY } from './actions';

export const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    company: {},
    user: null,
    access: {}
};

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN: {
            const { user, access, company } = action.payload;
            return {
                ...state,
                isLoggedIn: action.payload?.isLoggedIn,
                isInitialized: true,
                company,
                user,
                access
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isLoggedIn: false,
                isInitialized: true,
                company: {},
                user: {},
                access: {}
            };
        }
        case CHANGE_COMPANY: {
            return {
                ...state,
                company: action.payload.company
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
