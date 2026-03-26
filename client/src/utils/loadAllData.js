import { getTags } from "../services/TagsApi";
import { getTasks } from "../services/TasksAPI";
import { getUsers } from "../services/UsersAPI";

async function loadAllData(dispatch) {
    try {
        const { data: response }  = await getTasks();
        if (response && response.data && response.data.length > 0) {
            dispatch({ type: 'SET_TASKS', payload: response.data });
        }
    } catch (error) {
        console.error("Error on getting Tasks: ", error);
    }

    try {
        const { data: response }  = await getUsers();
        if (response && response.data && response.data.length > 0) {
            dispatch({ type: 'SET_USERS', payload: response.data });
        }
    } catch (error) {
        console.error("Error on getting Users: ", error);
    }

    try {
        const { data: response }  = await getTags();
        if (response && response.data && response.data.length > 0) {
            dispatch({ type: 'SET_TAGS', payload: response.data });
        }
    } catch (error) {
        console.error("Error on getting Tags: ", error);
    }
}

export default loadAllData;