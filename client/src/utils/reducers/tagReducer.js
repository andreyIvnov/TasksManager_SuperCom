const initialState = {
    tags: [],
}

const tagReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TAGS':
            return { ...state, tags: action.payload.map(tag => ({ ...tag, status: 'in' })) }
        default:
            return state
    }   
}

export default tagReducer