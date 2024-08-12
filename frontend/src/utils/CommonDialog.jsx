import { CloseOutlined } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Slide, Typography } from '@mui/material';
import { forwardRef, useEffect, useState } from 'react';
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

const CommonDialog = ({ open, children, title, showButton, sx = {}, onClose, isComment, buttons, id, saveButton }) => {
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        setOpenDialog(open ?? false);
    }, [open]);

    const openAdd = () => {
        setOpenDialog((prevState) => !prevState);
    };

    const handleCloseDialog = () => {
        setOpenDialog((prevState) => !prevState);
        open = false;
        if (onClose) onClose();
    };

    return (
        <Dialog
            open={openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            sx={{
                h2: { p: '10px 24px' },
                '& .MuiDialog-container ': {
                    justifyContent: 'flex-end',
                    '& .MuiPaper-root': {
                        m: 0,
                        p: 0,
                        borderRadius: '0px',
                        minWidth: { sm: '60%', xs: '100%' },
                        minHeight: '100%'
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
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 0
                        }}
                    >
                        <CloseOutlined />
                    </IconButton>
                </DialogTitle>
            )}
            <DialogContent dividers>{children}</DialogContent>
            <Grid container alignItems="center" spacing={gridSpacing} justifyContent="flex-end">
                <Grid item xs={12}>
                    <DialogActions>
                        {/* {buttons} */}

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
                </Grid>
            </Grid>
        </Dialog>
    );
};

export default CommonDialog;
