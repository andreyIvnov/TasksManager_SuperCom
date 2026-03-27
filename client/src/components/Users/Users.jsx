import { memo, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Stack
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import User from "./User"
import AddUser from "./AddUser"
import { deleteUser } from "../../services/UsersAPI"

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
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h4" component="h1" sx={{ 
                    fontWeight: 600,
                    color: 'text.primary'
                }}>
                    Users
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNewUser}
                    disabled={showAddUser}
                    sx={{ 
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3
                    }}
                >
                    New User
                </Button>
            </Box>

            {/* Users Table */}
            <Paper sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <TableContainer sx={{ height: '100%' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>
                                    Full Name
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>
                                    Email
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>
                                    Telephone
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100', width: 100 }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No users found. Click "New User" to add one.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow 
                                        key={user.id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'grey.50',
                                            },
                                        }}
                                    >
                                        <User userInfo={user} onRemove={removeUser} />
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add User Modal */}
            {showAddUser && (
                <AddUser 
                    onClose={handleAddUserClose}
                    onUserAdded={handleUserAdded}
                />
            )}
        </Box>
    )
}

export default memo(Users)