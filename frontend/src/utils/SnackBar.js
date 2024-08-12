import { store } from 'store';
import { SNACKBAR_OPEN } from 'store/actions';

export const successSnackBar = (res) => {
    store.dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: res.data.message,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        autoHideDuration: 3000,
        variant: 'alert',
        alertSeverity: 'success'
    });
};

export const errorSnackBar = (res) => {
    store.dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: res.data.message,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        autoHideDuration: 3000,
        variant: 'alert',
        alertSeverity: 'error'
    });
};

export const apiSuccessSnackBar = (res) => {
    store.dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: res.data.message,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        autoHideDuration: 3000,
        variant: 'alert',
        alertSeverity: 'success'
    });
};

export const apiValidationSnackBar = (res) => {
    store.dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: res.data.message,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        autoHideDuration: 3000,
        variant: 'alert',
        alertSeverity: 'error'
    });
};

export const apiErrorSnackBar = (err) => {
    store.dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: err.message,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        autoHideDuration: 3000,
        variant: 'alert',
        alertSeverity: 'error'
    });
};
