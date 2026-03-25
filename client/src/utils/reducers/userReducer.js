const initialState = {
    users: [],
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return { ...state, users: action.payload.map(user => ({ ...user, status: 'in' })) }
        default:
            return state
    }
}

export default userReducer