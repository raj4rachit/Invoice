import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import AnimateButton from 'ui-component/extended/AnimateButton';

const CenterDialog = ({ open, title, sx = {}, saveButton, id, onClose, children }) => {
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        setOpenDialog(open ?? false);
    }, [open]);

    const handleCloseDialog = () => {
        setOpenDialog((prevState) => !prevState);
        open = false;
        if (onClose) onClose();
    };

    return (
        <Dialog
            open={openDialog}
            keepMounted
            onClose={handleCloseDialog}
            sx={{
                '&>div:nth-of-type(3)': {
                    '&>div': {
                        minWidth: { md: '30%', xs: '90%' }
                    }
                },
                ...sx
            }}
        >
            {title && (
                <DialogTitle>
                    <Typography variant="h4" gutterBottom component="div">
                        {title}
                    </Typography>
                </DialogTitle>
            )}
            <DialogContent dividers>{children}</DialogContent>
            <DialogActions>
                {!saveButton && (
                    <AnimateButton>
                        <Button variant="contained" color="primary" type="submit" form={id}>
                            Save
                        </Button>
                    </AnimateButton>
                )}

                <Button variant="text" color="error" onClick={handleCloseDialog}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CenterDialog.propTypes = {
    open: propTypes.bool,
    title: propTypes.string,
    sx: propTypes.object,
    saveButton: propTypes.bool,
    id: propTypes.string,
    onClose: propTypes.func,
    children: propTypes.node
};

export default CenterDialog;
