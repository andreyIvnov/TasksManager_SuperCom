const initialState = {
    tasks: [],
}

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TASKS':
            return { ...state, tasks: action.payload.map(task => ({ ...task, status: 'in' })) }
        default:
            return state
    }
}

export default taskReducer