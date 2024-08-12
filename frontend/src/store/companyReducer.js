import { OPEN_COMPANY } from './actions';

export const initialState = {
    isOpen: false
};

const companyReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_COMPANY:
            return {
                isOpen: action.isOpen
            };
        default:
            return state;
    }
};

export default companyReducer;
