import  { combineReducers } from 'redux';

import tasksReducer from './taskReducer';
import userReducer from './userReducer';
import tagReducer from './tagReducer';

const rootReducer = combineReducers({
    taskReducer: tasksReducer,
    userReducer: userReducer,
    tagReducer: tagReducer,
})

export default rootReducer;