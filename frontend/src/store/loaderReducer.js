import * as actionTypes from './actions';
export const initialState = {
    isLoading: false
};

const loaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHOW_LOADER:
            return {
                isLoading: action.isLoading
            };
        case actionTypes.HIDE_LOADER:
            return {
                isLoading: action.isLoading
            };
        default:
            return state;
    }
};

export default loaderReducer;
