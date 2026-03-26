const initialState = {
    tags: [],
}

const tagReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TAGS':
            return { ...state, tags: action.payload.map(tag => ({ ...tag, status: 'in' })) }
        case 'ADD_TAG':
            return { ...state, tags: [...state.tags, { ...action.payload, status: 'in' }] }
        case 'REMOVE_TAG':
            return { ...state, tags: state.tags.filter(tag => tag.id !== action.payload) }
        default:
            return state
    }   
}

export default tagReducer