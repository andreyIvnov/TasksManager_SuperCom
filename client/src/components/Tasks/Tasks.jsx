import { memo, useMemo, useReducer, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Task from "./Task"
import AddTask from "./AddTask"
import { deleteTask } from "../../services/TasksAPI"
import "../../styles/Tasks.css"

import { INITIAL_STATE, tasksReducer} from '../../utils/localReducersManager/tasksReducer';

function Tasks() {
    const [state, localDispatch] = useReducer(tasksReducer, INITIAL_STATE);
    
    const allTasks = useSelector((state) => state.taskReducer.tasks);
    
    //Sort rows "by"
    const tasks = useMemo(() => {
        let filteredTasks = allTasks.filter(task => task.status !== 'del');
        
        if (state.sortField) {
            filteredTasks.sort((a, b) => {
                let aValue, bValue;
                
                switch (state.sortField) {
                    case 'title':
                        aValue = a.title?.toLowerCase() || '';
                        bValue = b.title?.toLowerCase() || '';
                        break;
                    case 'description':
                        aValue = a.description?.toLowerCase() || '';
                        bValue = b.description?.toLowerCase() || '';
                        break;
                    case 'user':
                        aValue = a.user?.fullName?.toLowerCase() || '';
                        bValue = b.user?.fullName?.toLowerCase() || '';
                        break;
                    case 'priority':
                        aValue = a.priority || 0;
                        bValue = b.priority || 0;
                        break;
                    case 'dueDate':
                        aValue = new Date(a.dueDate || 0);
                        bValue = new Date(b.dueDate || 0);
                        break;
                    default:
                        return 0;
                }
                
                if (aValue < bValue) return state.sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return state.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        
        return filteredTasks;
    }, [allTasks, state.sortField, state.sortDirection]);

    const dispatch = useDispatch();

    const handleSort = (field) => {
        if (state.sortField === field) {
            // Toggle direction if same field
            localDispatch({ type: 'TOGGLE_SORT_DIRECTION', payload: state.sortDirection === 'asc' ? 'desc' : 'asc' });
        } else {
            // Set new field with ascending direction
            localDispatch({ type: 'SET_SORT_FIELD', payload: field });
            localDispatch({ type: 'TOGGLE_SORT_DIRECTION', payload: 'asc' });
        }
    };

    const getSortIcon = (field) => {
        if (state.sortField !== field) return ' ↕️';
        return state.sortDirection === 'asc' ? ' ↑' : ' ↓';
    };

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
        <div className="tasks-container">
            <div className="tasks-header">
                <h1 className="tasks-title">Tasks</h1>
            </div>
            <div className="tasks-table-container">
                <table className="tasks-table">
                    <thead>
                        <tr>
                            <th 
                                onClick={() => handleSort('title')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Title{getSortIcon('title')}
                            </th>
                            <th 
                                onClick={() => handleSort('description')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Description{getSortIcon('description')}
                            </th>
                            <th 
                                onClick={() => handleSort('dueDate')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Due Date{getSortIcon('dueDate')}
                            </th>
                            <th 
                                onClick={() => handleSort('priority')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Priority{getSortIcon('priority')}
                            </th>
                            <th 
                                onClick={() => handleSort('user')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                User{getSortIcon('user')}
                            </th>
                            <th>Tags</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => {
                            return (
                                <tr key={task.id}><Task taskInfo={task} onRemove={removeTask}/></tr>
                            )
                        })}
                    </tbody>
                </table>
                
                <div className="tasks-actions">
                    <button 
                        className="tasks-new-btn"
                        onClick={handleNewTask}
                        disabled={state.showAddTask}
                    >
                        + New Task
                    </button>
                </div>

                {state.showAddTask && (
                    <AddTask 
                        onClose={handleAddTaskClose}
                        onTaskAdded={handleTaskAdded}
                    />
                )}  
            </div>
        </div>
    )
}

export default memo(Tasks)