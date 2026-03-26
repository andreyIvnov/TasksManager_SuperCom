const INITIAL_STATE = {
    showAddTask: false,
    sortField: null,
    sortDirection: 'asc'
}

const tasksReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'TOGGLE_ADD_TASK':
            return { ...state, showAddTask: action.payload };
        case 'SET_SORT_FIELD':
            return { ...state, sortField: action.payload };
        case 'TOGGLE_SORT_DIRECTION':
            return { ...state, sortDirection: action.payload };
        default:
            return state;
    }
}

export { INITIAL_STATE, tasksReducer };