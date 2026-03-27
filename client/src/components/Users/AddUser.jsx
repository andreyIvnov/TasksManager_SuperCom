import { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../../services/UsersAPI";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  CircularProgress
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

function AddUser({ onClose, onUserAdded }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        telephone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await createUser(formData);
            
            if (response.data && response.data.data) {
                const newUser = response.data.data;
                
                dispatch({ type: 'ADD_USER', payload: newUser });
                
                onUserAdded?.(newUser);
                onClose();
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Dialog 
            open={true} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: 'primary.main', 
                color: 'primary.contrastText',
                typography: 'h5',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <PersonIcon />
                Add New User
            </DialogTitle>
            
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ pt: 3 }}>
                    <Stack spacing={3}>
                        <TextField
                            name="fullName"
                            label="Full Name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            variant="outlined"
                            placeholder="Enter full name"
                            autoFocus
                        />
                        
                        <TextField
                            name="email"
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            variant="outlined"
                            placeholder="Enter email address"
                        />
                        
                        <TextField
                            name="telephone"
                            label="Telephone"
                            type="tel"
                            value={formData.telephone}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            variant="outlined"
                            placeholder="Enter phone number"
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
                    <Button 
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        variant="outlined"
                        color="inherit"
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: 500,
                            minWidth: 100 
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        variant="contained"
                        color="primary"
                        startIcon={isSubmitting ? <CircularProgress size={16} /> : <PersonIcon />}
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: 500,
                            minWidth: 120 
                        }}
                    >
                        {isSubmitting ? 'Adding...' : 'Add User'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddUser