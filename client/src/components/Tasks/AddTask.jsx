
import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../../services/TasksAPI";

import LookupField from "../LookupField";
import TagSelector from "../Tags/TagSelector";
import "../../styles/AddTask.css"

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
        <div style={{ 
            border: '2px solid #ccc', 
            padding: '20px', 
            margin: '10px 0',
            backgroundColor: '#000000',
            borderRadius: '5px'
        }}>
            <h3>Add New Task</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ textAlign: 'left', padding: '10px 0' }}>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <strong>Title: </strong>
                        <input 
                            type="text" 
                            name="title" 
                            value={state.formData.title}
                            onChange={handleInputChange}
                            required
                            style={{ width: '300px', padding: '5px' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <strong>Description: </strong> <br />
                        <textarea 
                            name="description" 
                            value={state.formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            placeholder="Enter task description..."
                            style={{ 
                                width: '300px', 
                                padding: '5px',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <strong>Due Date: </strong>
                        <input 
                            type="datetime-local" 
                            name="dueDate" 
                            value={state.formData.dueDate}
                            onChange={handleInputChange}
                            required
                            style={{ width: '300px', padding: '5px' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <strong>Priority: </strong>
                        <input 
                            type="number" 
                            min={1} 
                            max={3} 
                            name="priority" 
                            value={state.formData.priority}
                            onChange={handleInputChange}
                            style={{ width: '300px', padding: '5px' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <strong>User: </strong>
                        <LookupField 
                            options={state.usersLookupOpts}
                            defaultValue={state.selectedUser}
                            onChange={handleUserChange}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <strong>Tags: </strong>
                        <TagSelector 
                            selectedTags={state.selectedTags}
                            onTagChange={handleTagChange}
                            readOnly={false}
                        />
                    </div>
                    
                    <div className="add-task-actions">
                        <button 
                            type="submit" 
                            disabled={state.isSubmitting}
                            className="add-task-submit-btn"
                        >
                            {state.isSubmitting ? 'Creating...' : 'Create Task'}
                        </button>
                        <button 
                            type="button" 
                            onClick={handleCancel}
                            disabled={state.isSubmitting}
                            className="add-task-cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddTask