const INITITAL_STATE = {
    taskToEdit: {},
    defaultUser: null,
    usersLookupOpts: [],
    selectedTags: [],
    taskDataToUpdate: {} 
};

const taskEditReducer = (state = INITITAL_STATE, action) => {
    switch (action.type) {
        case 'SET_TASK_TO_EDIT':
            return { ...state, taskToEdit: action.payload };
        case 'SET_DEFAULT_USER':
            return { ...state, defaultUser: action.payload };   
        case 'SET_USERS_LOOKUP_OPTS':
            return { ...state, usersLookupOpts: action.payload };
        case 'SET_SELECTED_TAGS':
            return { ...state, selectedTags: action.payload };
        case 'UPDATE_TASK_FIELD':
            return { ...state, taskDataToUpdate: { ...state.taskDataToUpdate, [action.payload.field]: action.payload.value } };
        default:
            return state;
    }
}

export { taskEditReducer, INITITAL_STATE };