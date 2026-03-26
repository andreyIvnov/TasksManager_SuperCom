
import "../../styles/User.css"

function User({ userInfo, onRemove, inline = false }) {
    const handleRemove = () => {
        if (window.confirm(`Are you sure you want to delete ${userInfo.fullName}?`)) {
            onRemove(userInfo.id);
        }
    };

    if (inline) {
        return (
            <div className="user-inline">
                <div className="user-inline-name">{userInfo.fullName}</div>
                <div className="user-inline-phone">{userInfo.telephone}</div>
                <div className="user-inline-email">{userInfo.email}</div>
            </div>
        );
    }

    return (
        <>
            <td className="user-cell user-name">{userInfo.fullName}</td>
            <td className="user-cell user-email">{userInfo.email}</td>
            <td className="user-cell user-phone">{userInfo.telephone}</td>
            <td className="user-cell user-actions">
                {onRemove && (
                    <button 
                        className="btn-danger user-delete-btn" 
                        onClick={handleRemove}
                        title="Delete User"
                    >
                        🗑️
                    </button>
                )}
            </td>
        </>
    )
}

export default User