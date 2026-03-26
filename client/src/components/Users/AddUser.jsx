import { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../../services/UsersAPI";
import "../../styles/AddUser.css"

function AddUser({ onClose, onUserAdded }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        telephone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await createUser(formData);
            
            if (response.data && response.data.data) {
                const newUser = response.data.data;
                
                dispatch({ type: 'ADD_USER', payload: newUser });
                
                onUserAdded?.(newUser);
                onClose();
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="add-user-container">
            <h3>Add New User</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-content">
                    <div className="form-field">
                        <strong>Full Name: </strong>
                        <input 
                            type="text" 
                            name="fullName" 
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="Enter full name"
                        />
                    </div>
                    
                    <div className="form-field">
                        <strong>Email: </strong>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="Enter email address"
                        />
                    </div>
                    
                    <div className="form-field">
                        <strong>Telephone: </strong>
                        <input 
                            type="tel" 
                            name="telephone" 
                            value={formData.telephone}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="Enter phone number"
                        />
                    </div>
                </div>
                
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding...' : 'Add User'}
                    </button>
                    <button 
                        type="button" 
                        className="btn-secondary"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddUser