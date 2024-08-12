import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormControl, FormHelperText } from '@mui/material';
//
import Editor from '../editor';

// ----------------------------------------------------------------------

RHFEditor.propTypes = {
    name: PropTypes.string
};

export default function RHFEditor({ name, helperText, ...other }) {
    const { control } = useFormContext();
    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <Editor id={name} value={field.value} onChange={field.onChange} error={!!error} {...other} />
                )}
            />
            <FormHelperText error>{helperText}</FormHelperText>
        </>
    );
}
