import propTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

const DeleteDialog = ({ onDeleteHandler, onClose, open, dept, title, name }) => {
    const handleClose = () => {
        onClose();
    };
    const handleOk = () => {
        onDeleteHandler();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ p: 3 }}
            >
                <DialogTitle id="alert-dialog-title">
                    Are you sure you want to delete the
                    <strong>
                        {' '}
                        {dept} {title} {name}
                    </strong>
                    ? Click <strong>Yes, Delete</strong> to proceed or <strong>Cancel</strong> to cancel this action.
                </DialogTitle>
                <DialogActions sx={{ pr: 2.5 }}>
                    <Button variant="contained" onClick={handleOk}>
                        Yes, Delete{' '}
                    </Button>
                    <Button variant="text" color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

DeleteDialog.propTypes = {
    onDeleteHandler: propTypes.func.isRequired,
    onClose: propTypes.func.isRequired,
    open: propTypes.bool.isRequired,
    dept: propTypes.string.isRequired,
    title: propTypes.string,
    name: propTypes.string
};

export default DeleteDialog;
