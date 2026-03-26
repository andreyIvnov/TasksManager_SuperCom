import { memo, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import User from "./User"
import AddUser from "./AddUser"
import { deleteUser } from "../../services/UsersAPI"
import "../../styles/Users.css"

function Users() {  
    const [showAddUser, setShowAddUser] = useState(false);
    
    const allUsers = useSelector((state) => state.userReducer.users);
    const users = useMemo(() =>
        allUsers.filter(user => user.status !== 'del'),
        [allUsers]
    );

    const dispatch = useDispatch();

    const removeUser = async (id) => {
        try {
            const { data } = await deleteUser(id);
            dispatch({ type: 'DELETE_USER', payload: id });
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }

    const handleNewUser = () => {
        setShowAddUser(true);
    };

    const handleAddUserClose = () => {
        setShowAddUser(false);
    };

    const handleUserAdded = (newUser) => {
        setShowAddUser(false);
    };

    return (
        <div className="users-container">
            <div className="users-header">
                <h1 className="users-title">Users</h1>
            </div>
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Telephone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <User userInfo={user} onRemove={removeUser}/>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                
                <div className="users-actions">
                    <button 
                        className="users-new-btn"
                        onClick={handleNewUser}
                        disabled={showAddUser}
                    >
                        + New User
                    </button>
                </div>

                {showAddUser && (
                    <AddUser 
                        onClose={handleAddUserClose}
                        onUserAdded={handleUserAdded}
                    />
                )}  
            </div>
        </div>
    )
}

export default memo(Users)