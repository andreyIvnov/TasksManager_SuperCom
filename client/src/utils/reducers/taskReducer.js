const initialState = {
    tasks: [],
}

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TASKS':
            return { ...state, tasks: action.payload.map(task => ({ ...task, status: 'in' })) }
        case 'DELETE_TASK':
            return { ...state, tasks: state.tasks.map(task => task.id === action.payload ? { ...task, status: 'del' } : task) }
        case 'ADD_TASK':
            return { ...state, tasks: [...state.tasks, { ...action.payload, status: 'in' }] }
        case 'UPDATE_TASK':
            return { ...state, tasks: state.tasks.map(task => task.id === action.payload.id ? { ...action.payload, status: 'in' } : task) }
        default:
            return state
    }
}

export default taskReducer