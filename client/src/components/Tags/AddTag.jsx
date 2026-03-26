import { useState } from "react"
import "../../styles/AddTag.css"

function AddTag({ onSave }) {
    const [newTagName, setNewTagName] = useState("")

    const handleSave = async () => {
        if (newTagName.trim()) {
            await onSave({ name: newTagName });
            setNewTagName(""); // Clear input after saving
        }
    }

    return (
        <div className="add-tag-container">
            <h2 className="add-tag-title">Add New Tag</h2>
            <div className="add-tag-field">
                <label className="add-tag-label">Name:</label>
                <input
                    type="text"
                    name="name"
                    maxLength={25}
                    value={newTagName}
                    className="add-tag-input"
                    onChange={(e) => setNewTagName(e.target.value)}
                />
            </div>
            <button
                className="add-tag-save-btn"
                onClick={handleSave}
            >
                Create
            </button>
        </div>
    )
}

export default AddTag