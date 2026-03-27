import { useEffect, useState } from "react";
import { 
  Autocomplete, 
  TextField, 
  Box, 
  Typography,
  Avatar 
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

function LookupField({ options, defaultValue, onChange, entityName = "user" }) {
    const [value, setValue] = useState(defaultValue || null);

    useEffect(() => {
        setValue(defaultValue || null);
    }, [defaultValue]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        onChange(newValue);
    };

    const safeOptions = options || [];

    return (
        <Autocomplete
            value={value}
            onChange={handleChange}
            options={safeOptions}
            getOptionLabel={(option) => option?.label || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={`Search ${entityName}...`}
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        sx: {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'grey.300',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                            },
                        }
                    }}
                />
            )}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                    <Box 
                        key={key}
                        component="li" 
                        {...optionProps}
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            p: 1
                        }}
                    >
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                            <PersonIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography variant="body2">
                            {option.label}
                        </Typography>
                    </Box>
                );
            }}
            noOptionsText="No users found"
            clearOnBlur={false}
            selectOnFocus
            sx={{
                '& .MuiAutocomplete-clearIndicator': {
                    color: 'grey.500',
                },
                '& .MuiAutocomplete-popupIndicator': {
                    color: 'grey.500',
                },
            }}
        />
    );
}

export default LookupField;