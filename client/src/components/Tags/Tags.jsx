import { createTag, deleteTag } from '../../services/TagsApi'
import { useDispatch, useSelector } from 'react-redux'

import Tag from './Tag'
import AddTag from './AddTag'
import '../../styles/Tags.css'
import { HttpStatusCode } from 'axios'

function Tags() {
    const dispatch = useDispatch();
    const storedTags = useSelector((state) => state.tagReducer.tags);
    
    const addNewTag = async (tag) => {
        const { data: response } = await createTag(tag);
        if (response && response.code === HttpStatusCode.Created) {
            dispatch({ type: 'ADD_TAG', payload: response.data });
        }else {
            console.error(`Failed to create tag\n Response: ${response ? JSON.stringify(response) : 'No response data'}`);
        }
    }

    const removeTag = async (id) => {
        const {data: response} = await deleteTag(id);
        if (response && response.code === HttpStatusCode.Ok) {
            dispatch({ type: 'REMOVE_TAG', payload: id });
        }else {
            console.error(`Failed to delete tag with id: ${id}\n Response: ${response ? JSON.stringify(response) : 'No response data'}`);
        }
    }

    return (
        <>
            <div className="tags-container">
                <div className="tags-list">
                    {storedTags.map((tag) => (
                        <Tag key={tag.id} tagInfo={tag} onDelete={removeTag}/>
                    ))}
                </div>
            </div>
            <div className="add-tag-wrapper">
                <AddTag onSave={addNewTag}/>
            </div>
        </>
    )
}

export default Tags