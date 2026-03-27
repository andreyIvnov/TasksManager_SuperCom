
import { 
  Box, 
  Typography, 
  IconButton, 
  Avatar, 
  Stack,
  TableCell 
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Person as PersonIcon 
} from '@mui/icons-material';

function User({ userInfo, onRemove, inline = false }) {
    const handleRemove = () => {
        if (window.confirm(`Are you sure you want to delete ${userInfo.fullName}?`)) {
            onRemove(userInfo.id);
        }
    };

    if (inline) {
        return (
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
            }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                    <PersonIcon sx={{ fontSize: 14 }} />
                </Avatar>
                <Stack spacing={0}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {userInfo.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {userInfo.email}
                    </Typography>
                </Stack>
            </Box>
        );
    }

    return (
        <>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <PersonIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {userInfo.fullName}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell>
                <Typography variant="body2">
                    {userInfo.email}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2">
                    {userInfo.telephone}
                </Typography>
            </TableCell>
            <TableCell>
                {onRemove && (
                    <IconButton 
                        onClick={handleRemove}
                        color="error"
                        size="small"
                        sx={{ bgcolor: 'error.50' }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                )}
            </TableCell>
        </>
    )
}

export default User