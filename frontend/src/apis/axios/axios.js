import axios from 'axios';
import config from 'config';
import { store } from 'store';
import { HIDE_LOADER, LOGOUT, SHOW_LOADER } from 'store/actions';
import { errorSnackBar } from 'utils/SnackBar';

const axiosClient = axios.create({
    baseURL: `${config.apiBaseURL}`,
    // withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

// interceptor for http
const hideLoader = () => {
    store.dispatch({
        type: HIDE_LOADER,
        isLoading: false
    });
};

axiosClient.interceptors.request.use(
    (req) => {
        store.dispatch({
            type: SHOW_LOADER,
            isLoading: true
        });
        return req;
    },
    (error) => {
        hideLoader();
        return Promise.reject(error);
    }
);

const responseErrorHandler = (error) => {
    hideLoader();
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('serviceToken');
        store.dispatch({ type: LOGOUT });
        errorSnackBar(error.response);
    }
    if (error.response && (error.response.status === 403 || error.response.status === 400 || error.response.status === 408)) {
        errorSnackBar(error.response);
    }
    return Promise.reject((error.response && error.response?.data) || 'Wrong Services');
};

axiosClient.interceptors.response.use(
    (response) => {
        store.dispatch({
            type: HIDE_LOADER,
            isLoading: false
        });
        // if (response.data && response.data.title === 'ERROR') {
        if (response.data && response.data.status === '0') {
            errorSnackBar(response);
        }
        return response;
    },
    (error) => responseErrorHandler(error)
);

export default axiosClient;
