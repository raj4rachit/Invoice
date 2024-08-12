import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const status = [{ label: 'Active' }, { label: 'Inactive' }];
const InlineStatus = ({ selectedValue, width, changeValue, disabled }) => {
    const [showChip, setChip] = useState(true);
    const [value, setValue] = useState('');
    useEffect(() => {
        setValue(selectedValue);
    }, [selectedValue]);
    return (
        <Stack direction="row" spacing={1} sx={{ height: '30px', width: { sm: width || '100px' } }} alignItems="center">
            {showChip ? (
                <Typography
                    onClick={(event) => {
                        if (disabled) event.preventDefault();
                        else setChip(false);
                    }}
                    color={value === 'Active' ? 'primary' : 'error'}
                    sx={{ cursor: 'pointer' }}
                >
                    {value}
                </Typography>
            ) : (
                <>
                    <TextField
                        size="small"
                        disabled={disabled}
                        id="outlined-select-currency"
                        select
                        value={value}
                        onChange={(event) => {
                            const val = event.target.value;
                            setValue(val);
                            if (changeValue) changeValue(val);
                        }}
                        // autoFocus
                        onBlur={() => {
                            setChip(true);
                        }}
                        onClick={() => setChip(true)}
                    >
                        {status.map((option, index) => (
                            <MenuItem key={index} value={option.label}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </>
            )}
        </Stack>
    );
};

export default InlineStatus;
