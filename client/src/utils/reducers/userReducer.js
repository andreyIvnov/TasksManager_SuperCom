const initialState = {
    users: [],
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return { ...state, users: action.payload.map(user => ({ ...user, status: 'in' })) }
        case 'ADD_USER':
            return { 
                ...state, 
                users: [...state.users, { ...action.payload, status: 'in' }] 
            }
        case 'DELETE_USER':
            return {
                ...state,
                users: state.users.map(user => 
                    user.id === action.payload 
                        ? { ...user, status: 'del' }
                        : user
                )
            }
        case 'UPDATE_USER':
            return {
                ...state,
                users: state.users.map(user => 
                    user.id === action.payload.id
                        ? { ...action.payload, status: 'in' }
                        : user
                )
            }
        default:
            return state
    }
}

export default userReducer