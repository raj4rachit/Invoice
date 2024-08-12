import propTypes from 'prop-types';
import { Card, CardContent, CardHeader, Popper, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import { useEffect, useState } from 'react';

export default function TitlePopper({ open, title, itemList }) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        setAnchorEl(anchorEl ? null : open);
    }, [open]);

    const display = Boolean(anchorEl);
    const id = display ? 'simple-popper' : undefined;

    return (
        <div>
            <Popper id={id} open={display} anchorEl={anchorEl}>
                <Card variant="outlined">
                    <CardHeader
                        title={<Typography sx={{ color: '#FFFFFF' }}>{title}</Typography>}
                        sx={{ padding: '15px', backgroundColor: theme.palette.primary[800] }}
                    />
                    <CardContent sx={{ padding: '10px' }}>
                        {itemList.map((i, idx) => (
                            <Typography key={idx} variant="subtitle1">
                                {itemList[idx]}
                            </Typography>
                        ))}
                    </CardContent>
                </Card>
            </Popper>
        </div>
    );
}

TitlePopper.propTypes = {
    open: propTypes.any,
    title: propTypes.string.isRequired,
    itemList: propTypes.array
};
