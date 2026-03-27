import { memo, useMemo, useReducer, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Avatar,
  Paper,
  Stack,
  Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon
} from '@mui/icons-material';

import AddTask from "./AddTask"
import { deleteTask } from "../../services/TasksAPI"
import { INITIAL_STATE, tasksReducer} from '../../utils/localReducersManager/tasksReducer';
import '../../styles/Tasks.css';

function Tasks() {
    const [state, localDispatch] = useReducer(tasksReducer, INITIAL_STATE);
    const navigate = useNavigate();
    const allTasks = useSelector((state) => state.taskReducer.tasks);
    const dispatch = useDispatch();

    // Transform tasks for DataGrid
    const rows = useMemo(() => {
        return allTasks
            .filter(task => task.status !== 'del')
            .map(task => ({
                id: task.id,
                title: task.title || '',
                description: task.description || '',
                dueDate: task.dueDate ? new Date(task.dueDate) : null,
                priority: task.priority || 0,
                user: task.user || null,
                tags: task.tags || [],
            }));
    }, [allTasks]);

    // Define columns for DataGrid
    const columns = [
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <Typography 
                    variant="body2" 
                    className="tasks-title-clickable"
                    onClick={() => navigate(`/tasks/${params.row.id}`)}
                >
                    {params.value}
                </Typography>
            ),
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1.5,
            minWidth: 200,
            renderCell: (params) => (
                <Tooltip title={params.value || ''} placement="top">
                    <Typography variant="body2" className="tasks-description-ellipsis">
                        {params.value}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            field: 'dueDate',
            headerName: 'Due Date',
            width: 160,
            renderCell: (params) => (
                <Typography variant="body2">
                    {params.value ? new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }).format(params.value) : '-'}
                </Typography>
            ),
            sortComparator: (v1, v2) => {
                if (!v1 && !v2) return 0;
                if (!v1) return -1;
                if (!v2) return 1;
                return v1.getTime() - v2.getTime();
            },
        },
        {
            field: 'priority',
            headerName: 'Priority',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Chip 
                    label={params.value || 0}
                    size="small"
                    color={params.value === 1 ? 'error' : params.value === 3 ? 'default' : 'warning'}
                    variant="filled"
                    className="tasks-priority-chip"
                />
            ),
        },
        {
            field: 'user',
            headerName: 'User',
            width: 180,
            renderCell: (params) => {
                if (!params.value) {
                    return (
                        <Typography variant="body2" color="text.secondary">
                            No user assigned
                        </Typography>
                    );
                }
                return (
                    <Box className="tasks-user-container">
                        <Avatar className="tasks-user-avatar">
                            <PersonIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography variant="body2">
                            {params.value.fullName || params.value.name || 'Unknown'}
                        </Typography>
                    </Box>
                );
            },
            sortComparator: (v1, v2) => {
                const name1 = v1?.fullName || v1?.name || '';
                const name2 = v2?.fullName || v2?.name || '';
                return name1.localeCompare(name2);
            },
        },
        {
            field: 'tags',
            headerName: 'Tags',
            flex: 1,
            minWidth: 200,
            sortable: false,
            renderCell: (params) => (
                <Box className="tasks-tags-container">
                    {params.value && params.value.length > 0 ? (
                        params.value.slice(0, 3).map((tag, index) => (
                            <Chip
                                key={tag.id || index}
                                label={tag.name || tag}
                                size="small"
                                variant="outlined"
                                className="tasks-tag-chip"
                            />
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No tags
                        </Typography>
                    )}
                    {params.value && params.value.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                            +{params.value.length - 3} more
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            field: 'actions',
            headerName: '',
            width: 120,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Stack direction="row" spacing={0.5} className="tasks-actions-container">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/tasks/${params.row.id}`)}
                        className="tasks-edit-button"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeTask(params.row.id)}
                        className="tasks-delete-button"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    const removeTask = async (id) => {
        try {
            const { data } = await deleteTask(id);
            dispatch({ type: 'DELETE_TASK', payload: id });
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    const handleNewTask = () => {
        localDispatch({ type: 'TOGGLE_ADD_TASK', payload: true });
    };

    const handleAddTaskClose = () => {
        localDispatch({ type: 'TOGGLE_ADD_TASK', payload: false });
    };

    const handleTaskAdded = (newTask) => {
        localDispatch({ type: 'TOGGLE_ADD_TASK', payload: false });
    };

    return (
        <Box className="tasks-container">
            {/* Header */}
            <Box className="tasks-header">
                <Typography variant="h4" component="h1" className="tasks-title">
                    Tasks
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNewTask}
                    disabled={state.showAddTask}
                    className="tasks-new-button"
                >
                    New Task
                </Button>
            </Box>

            {/* DataGrid */}
            <Box className="tasks-data-grid-container">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[8, 16, 25]}
                    pagination
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableColumnSelector
                    disableDensitySelector
                    disableVirtualization={false}
                    autoHeight={false}
                    className="tasks-data-grid"
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 8, page: 0 },
                        },
                        sorting: {
                            sortModel: [{ field: 'priority', sort: 'desc' }],
                        },
                    }}
                />
            </Box>

            {/* Add Task Modal */}
            {state.showAddTask && (
                <AddTask 
                    onClose={handleAddTaskClose}
                    onTaskAdded={handleTaskAdded}
                />
            )}
        </Box>
    )
}

export default memo(Tasks)