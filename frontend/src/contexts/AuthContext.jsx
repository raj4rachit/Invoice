import { LoginApi, LogoutApi } from 'apis/Auth';
import moment from 'moment';
import { useState } from 'react';
import { createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN, LOGOUT, OPEN_COMPANY } from 'store/actions';
import { apiErrorSnackBar, apiValidationSnackBar } from 'utils/SnackBar';

const setServiceToken = (serviceToken) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', JSON.stringify(serviceToken));
    } else {
        localStorage.removeItem('serviceToken');
    }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const cart = useSelector((state) => state.account);
    const dispatch = useDispatch();
    const [recall, setRecall] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = localStorage.getItem('serviceToken');
                if (serviceToken) {
                    dispatch({
                        type: LOGIN,
                        payload: {
                            ...cart,
                            isLoggedIn: true
                        }
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                dispatch({
                    type: LOGOUT
                });
            }
        };

        init();
    }, []);

    const login = (values) => {
        LoginApi(values)
            .then((res) => {
                if (res.data && res.data.status === 1) {
                    localStorage.setItem('type', 'login');
                    const { data } = res.data;
                    setServiceToken(data.token);
                    const companyData = {
                        company_id: '0',
                        start_date: moment(data.user.financial_start_date).format('YYYY-MM-DD'),
                        end_date: moment(data.user.financial_end_date).format('YYYY-MM-DD')
                    };

                    localStorage.setItem('companyData', JSON.stringify(data.company));
                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user: data.user,
                            access: data.access,
                            company: data.company
                        }
                    });
                } else {
                    apiValidationSnackBar(res);
                }
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    const logOut = async () => {
        await LogoutApi()
            .then((res) => {
                dispatch({
                    type: LOGOUT,
                    payload: {
                        isLoggedIn: false
                    }
                });
                setServiceToken(null);
                localStorage.removeItem('companyData');
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    };

    const checkRestriction = (slug) => {
        return cart.access.restriction ? cart.access.restriction.filter((a) => a === slug).length > 0 : false;
    };

    const recallComponent = () => {
        setRecall((prevState) => !prevState);
    };

    const checkCompany = () => {
        dispatch({
            type: OPEN_COMPANY,
            isOpen: cart.company.company_id === '0' ? true : false
        });
    };

    return (
        <AuthContext.Provider value={{ ...cart, checkRestriction, login, logOut, recallComponent, recall, checkCompany }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
