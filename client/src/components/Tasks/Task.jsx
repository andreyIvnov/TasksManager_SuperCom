import { memo, useState } from "react"
import { Link } from "react-router-dom"
import TagSelector from "../Tags/TagSelector"
import User from "../Users/User"
import "../../styles/Task.css"

function Task({ taskInfo, onRemove}) {
    const [options, setOptions] = useState({
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })

    return (
        <>
            <td><Link to={`${taskInfo.id}`}>{taskInfo.title}</Link></td>
            <td>{taskInfo.description}</td>
            <td style={{textAlign:'center'}}>{new Intl.DateTimeFormat('en-GB', options).format(new Date(taskInfo.dueDate))}</td>
            <td style={{textAlign:'center'}}>{taskInfo.priority}</td>
            <td>{taskInfo.user ? <User userInfo={taskInfo.user} inline={true} /> : 'No user assigned'}</td>    
            <td style={{textAlign:'left', padding:'5px 10px 5px 1px'}}>
                <TagSelector 
                    selectedTags={taskInfo.tags || []} 
                    taskId={taskInfo.id}
                    readOnly={true}
                />
            </td>
            <td>
                <div className="task-actions">
                    <button className="task-edit-btn">
                        <Link to={`${taskInfo.id}`}>Edit</Link>
                    </button>
                </div>
            </td>
            <td>
                <div className="task-actions">
                    <button 
                        className="task-delete-btn"
                        onClick={() => onRemove(taskInfo.id)}
                    >
                        Delete
                    </button>
                </div>
            </td>
        </>
    )
}

export default memo(Task)