const INITIAL_STATE = {
    selectedUser: null,
    selectedTags: [],
    usersLookupOpts: [],
    isSubmitting: false,
    formData:{
        title: '',
        description: '',
        dueDate: new Date().toISOString().slice(0,16), 
        priority: 3,
        userId: null,
        isReminderSent: false
    }
}

const addTaskReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_SELECTED_USER':
            return { ...state, selectedUser: action.payload };
        case 'SET_SELECTED_TAGS':
            return { ...state, selectedTags: action.payload };
        case 'SET_USERS_LOOKUP_OPTS':
            return { ...state, usersLookupOpts: action.payload };
        case 'SET_IS_SUBMITTING':
            return { ...state, isSubmitting: action.payload };
        case 'SET_FORM_DATA':
            return { ...state, formData: { ...state.formData, ...action.payload } };
        default:
            return state;
    }
}

export { addTaskReducer, INITIAL_STATE };