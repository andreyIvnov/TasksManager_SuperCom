
import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../../services/TasksAPI";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

import LookupField from "../LookupField";
import TagSelector from "../Tags/TagSelector";

import { INITIAL_STATE, addTaskReducer } from "../../utils/localReducersManager/addTaskReducer";


function AddTask({ onClose, onTaskAdded }) {
    const [state, localDispatch] = useReducer(addTaskReducer, INITIAL_STATE);

    const dispatch = useDispatch();
    const allUsers = useSelector((state) => state.userReducer.users);

    useEffect(() => {
        if (allUsers.length > 0) {
            localDispatch({ type: 'SET_USERS_LOOKUP_OPTS', payload: allUsers.map(u => ({ id: u.id, label: u.fullName })) });
        }
    }, [allUsers]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        localDispatch({ type: 'SET_FORM_DATA', payload: { [name]: type === 'checkbox' ? checked : value } });
    };

    const handleUserChange = (selectedUser) => {
        localDispatch({ type: 'SET_SELECTED_USER', payload: selectedUser });
        localDispatch({ type: 'SET_FORM_DATA', payload: { userId: selectedUser?.id || null } });
    };

    const handleTagChange = (tags) => {
        localDispatch({ type: 'SET_SELECTED_TAGS', payload: tags });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        localDispatch({ type: 'SET_IS_SUBMITTING', payload: true });

        try {
            const taskData = {
                ...state.formData,
                userId: state.selectedUser?.id || null,
                tagIds: state.selectedTags.map(tag => tag.id)
            };

            const response = await createTask(taskData);
            
            if (response.data && response.data.data) {
                const newTask = response.data.data;
                
                dispatch({ type: 'ADD_TASK', payload: newTask });
                
                onTaskAdded?.(newTask);
                onClose();
            }
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Error creating task. Please try again.');
        } finally {
            localDispatch({ type: 'SET_IS_SUBMITTING', payload: false });
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
                fontWeight: 600
            }}>
                Add New Task
            </DialogTitle>
            
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ pt: 3 }}>
                    <Stack spacing={3}>
                        <TextField
                            name="title"
                            label="Title"
                            value={state.formData.title}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />
                        
                        <TextField
                            name="description"
                            label="Description"
                            value={state.formData.description}
                            onChange={handleInputChange}
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            placeholder="Enter task description..."
                        />
                        
                        <TextField
                            name="dueDate"
                            label="Due Date"
                            type="datetime-local"
                            value={state.formData.dueDate}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        
                        <TextField
                            name="priority"
                            label="Priority"
                            type="number"
                            inputProps={{ min: 1, max: 3 }}
                            value={state.formData.priority}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            helperText="Priority level: 1 (High), 2 (Medium), 3 (Low)"
                        />
                        
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.primary' }}>
                                Assigned User
                            </Typography>
                            <LookupField 
                                options={state.usersLookupOpts}
                                defaultValue={state.selectedUser}
                                onChange={handleUserChange}
                            />
                        </Box>
                        
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.primary' }}>
                                Tags
                            </Typography>
                            <TagSelector 
                                selectedTags={state.selectedTags}
                                onTagChange={handleTagChange}
                                readOnly={false}
                            />
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
                    <Button 
                        onClick={handleCancel}
                        disabled={state.isSubmitting}
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
                        disabled={state.isSubmitting}
                        variant="contained"
                        color="primary"
                        startIcon={state.isSubmitting ? <CircularProgress size={16} /> : null}
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: 500,
                            minWidth: 120 
                        }}
                    >
                        {state.isSubmitting ? 'Creating...' : 'Create Task'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddTask