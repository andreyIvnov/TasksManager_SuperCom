
import '../../styles/Tag.css'

function Tag({ tagInfo, onDelete }) {
  return (
    <div className="tag-container">
      <div className="tag-item">{tagInfo.name}</div>
      <button
        className="tag-delete-btn"
        onClick={() => onDelete(tagInfo.id)}
      >
        Delete
      </button>
    </div>
  )
}

export default Tag