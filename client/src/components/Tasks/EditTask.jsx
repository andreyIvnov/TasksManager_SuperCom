import { useEffect, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  Paper,
  IconButton,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';

import LookupField from "../LookupField";
import TagSelector from "../Tags/TagSelector";
import { updateTask } from "../../services/TasksAPI"
import { INITITAL_STATE, taskEditReducer } from "../../utils/localReducersManager/taskEditReducer";

function EditTask() {
    const [state, localDispatch] = useReducer(taskEditReducer, INITITAL_STATE);

    const allTasks = useSelector((state) => state.taskReducer.tasks);
    const allUsers = useSelector((state) => state.userReducer.users);

    const reduxDispatch = useDispatch(); // For updating main Redux store
    const navigateTo = useNavigate();
    const { id: selectedTaskId } = useParams();

    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {

        if (allUsers.length > 0){
            localDispatch({ type: 'SET_USERS_LOOKUP_OPTS', payload: allUsers.map(u => ({ id: u.id, label: u.fullName })) });
        }
        if (allTasks.length > 0 && selectedTaskId) {
            const foundTask = allTasks.find((task) => task.id == selectedTaskId);
            if (foundTask) {
                localDispatch({ type: 'SET_TASK_TO_EDIT', payload: foundTask });
                localDispatch({ type: 'SET_SELECTED_TAGS', payload: foundTask.tags || [] });
                if (foundTask.user) {
                    localDispatch({ type: 'SET_DEFAULT_USER', payload: { id: foundTask.user.id, label: foundTask.user.fullName } });
                }
            }
        }
    }, [allTasks, selectedTaskId, allUsers]);

    const handleTagChange = (tags, taskId) => {
        localDispatch({ type: 'UPDATE_TASK_FIELD', payload: { field: 'tags', value: tags } });
        localDispatch({ type: 'UPDATE_TASK_FIELD', payload: { field: 'tagids', value: tags.map(tag => tag.id) } });
    };

    const handleUserChange = (selectedOption) => {
        localDispatch({ type: 'UPDATE_TASK_FIELD', payload: { field: 'userId', value: selectedOption && selectedOption.id ? selectedOption.id : null } });
        localDispatch({ type: 'UPDATE_TASK_FIELD', payload: { field: 'user', value: selectedOption && selectedOption.id ? allUsers.find(u => u.id === selectedOption.id) : null } });
    }

    const saveTaskChanges = async () => {
        try {
            const {data} = await updateTask(state.taskToEdit.id, state.taskDataToUpdate);
            if (data && data.code === 200) {
                localDispatch({ type: 'UPDATE_TASK', payload: state.taskDataToUpdate });
                
                const updatedTask = { ...state.taskToEdit, ...state.taskDataToUpdate };
                reduxDispatch({ type: 'UPDATE_TASK', payload: updatedTask });
                
                navigateTo('/tasks');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Error updating task. Please try again.');
        }
    };

    const handleChanges = (e) => {
        const { name, value } = e.target;
        localDispatch({ type: 'UPDATE_TASK_FIELD', payload: { field: name, value } });
    }


    return (
        <Box sx={{ height: '100%' }}>
            {/* Header with breadcrumbs */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton 
                    onClick={() => navigateTo('/tasks')}
                    sx={{ bgcolor: 'grey.100' }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                    <Link 
                        color="inherit" 
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigateTo('/tasks')}
                    >
                        Tasks
                    </Link>
                    <Typography color="text.primary" fontWeight={500}>
                        Edit Task
                    </Typography>
                </Breadcrumbs>
            </Box>

            <Paper sx={{ p: 3, height: 'calc(100% - 100px)', overflow: 'auto' }}>
                <Stack spacing={3}>
                    <Typography variant="h5" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
                        Edit Task
                    </Typography>
                    
                    <TextField
                        name="title"
                        label="Title"
                        defaultValue={state.taskToEdit.title}
                        onChange={handleChanges}
                        fullWidth
                        variant="outlined"
                    />
                    
                    <TextField
                        name="description"
                        label="Description"
                        defaultValue={state.taskToEdit.description}
                        onChange={handleChanges}
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                    />
                    
                    <TextField
                        name="dueDate"
                        label="Due Date"
                        type="datetime-local"
                        defaultValue={formatDateTimeLocal(state.taskToEdit.dueDate)}
                        onChange={handleChanges}
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
                        defaultValue={state.taskToEdit.priority}
                        onChange={handleChanges}
                        fullWidth
                        variant="outlined"
                        helperText="Priority level: 1 (High), 2 (Medium), 3 (Low)"
                    />
                    
                    <Box>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                            Assigned User
                        </Typography>
                        <LookupField 
                            options={state.usersLookupOpts} 
                            defaultValue={state.defaultUser}
                            onChange={handleUserChange}
                        />
                    </Box>
                    
                    <Box>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                            Tags
                        </Typography>
                        <TagSelector 
                            selectedTags={state.selectedTags}
                            onTagChange={handleTagChange}
                            taskId={selectedTaskId}
                            readOnly={false}
                        />
                    </Box>
                    
                    <Box sx={{ pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                            onClick={saveTaskChanges}
                            variant="contained"
                            startIcon={<SaveIcon />}
                            size="large"
                            sx={{ 
                                textTransform: 'none',
                                fontWeight: 500,
                                px: 4
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}

export default EditTask