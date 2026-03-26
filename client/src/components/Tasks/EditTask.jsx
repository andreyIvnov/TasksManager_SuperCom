import { useEffect, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LookupField from "../LookupField";
import TagSelector from "../Tags/TagSelector";
import { updateTask } from "../../services/TasksAPI"

import { INITITAL_STATE, taskEditReducer } from "../../utils/localReducersManager/taskEditReducer";
import "../../styles/EditTask.css"

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
        <>
            <div>EditTask</div>
            <div style={{ textAlign: 'left', padding: '10px 10px 10px 10px' }}>
                <strong>Title: </strong>        <input onChange={handleChanges} type="text" name="title" defaultValue={state.taskToEdit.title} /><br />
                <strong>Description: </strong><br /> 
                <textarea onChange={handleChanges} name="description" defaultValue={state.taskToEdit.description} rows="4" placeholder="Enter task description..." style={{ width: '300px', padding: '5px', resize: 'vertical', fontFamily: 'inherit' }} /><br />
                <strong>Due Date: </strong>     <input onChange={handleChanges} type="datetime-local" name="dueDate" defaultValue={formatDateTimeLocal(state.taskToEdit.dueDate)} /><br />
                <strong>Priority: </strong>     <input onChange={handleChanges} type="number" min={1} max={3} name="priority" defaultValue={state.taskToEdit.priority} /><br />
                <strong>User: </strong>
                <LookupField 
                    options={state.usersLookupOpts} 
                    defaultValue={state.defaultUser}
                    onChange={handleUserChange}
                /><br />
                <strong>Tags: </strong>
                <TagSelector 
                    selectedTags={state.selectedTags}
                    onTagChange={handleTagChange}
                    taskId={selectedTaskId}
                    readOnly={false}
                />
                <div className="edit-task-actions">
                    <button 
                        className="edit-task-save-btn"
                        onClick={saveTaskChanges}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    )
}

export default EditTask