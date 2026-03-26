import { useState, useMemo, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { createTag } from "../../services/TagsApi"
import '../../styles/TagSelector.css'

function TagSelector({ selectedTags = [], onTagChange, taskId, readOnly = false }) {
    const allTagsFromStore = useSelector((state) => state.tagReducer.tags);
    const allTags = useMemo(() => 
        allTagsFromStore.filter(tag => tag.status !== 'del'),
        [allTagsFromStore]
    );
    const [selectedTagIds, setSelectedTagIds] = useState(selectedTags.map(tag => tag.id) || []);
    const [newTagName, setNewTagName] = useState('');
    const [isCreatingTag, setIsCreatingTag] = useState(false);
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        setSelectedTagIds(selectedTags.map(tag => tag.id) || []);
    }, [selectedTags]);
    
    const availableTags = useMemo(() => 
        allTags.filter(tag => !selectedTagIds.includes(tag.id)),
        [allTags, selectedTagIds]
    );

    const handleTagAdd = (tagId) => {
        if (readOnly || !tagId || tagId === '') return;
        
        const newSelectedIds = [...selectedTagIds, parseInt(tagId)];
        setSelectedTagIds(newSelectedIds);
        
        // Find the full tag objects to pass back
        const selectedTagObjects = allTags.filter(tag => newSelectedIds.includes(tag.id));
        onTagChange?.(selectedTagObjects, taskId);
    };

    const handleTagRemove = (tagIdToRemove) => {
        if (readOnly) return;
        
        const newSelectedIds = selectedTagIds.filter(id => id !== tagIdToRemove);
        setSelectedTagIds(newSelectedIds);
        
        // Find the full tag objects to pass back
        const selectedTagObjects = allTags.filter(tag => newSelectedIds.includes(tag.id));
        onTagChange?.(selectedTagObjects, taskId);
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim() || readOnly) return;
        
        setIsCreatingTag(true);
        
        try {
            const response = await createTag({ name: newTagName.trim() });
            
            if (response.data && response.data.data) {
                const newTag = response.data.data;

                dispatch({ type: 'ADD_TAG', payload: newTag });
                
                const newSelectedIds = [...selectedTagIds, newTag.id];
                setSelectedTagIds(newSelectedIds);
                
                const updatedAllTags = [...allTags, newTag];
                const selectedTagObjects = updatedAllTags.filter(tag => newSelectedIds.includes(tag.id));
                
                onTagChange?.(selectedTagObjects, taskId);
                
                setNewTagName('');
            }
        } catch (error) {
            alert('Error creating tag. Please try again.');
        } finally {
            setIsCreatingTag(false);
        }
    };

    const handleCreateTagKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCreateTag();
        }
    };

    return (
        <div className="tag-selector-container">
            <div className="selected-tags">
                {selectedTagIds.map(tagId => {
                    const tag = allTags.find(t => t.id === tagId);
                    return tag ? (
                        <span key={tagId} className="tag-chip">
                            {tag.name}
                            {!readOnly && (
                                <button 
                                    type="button"
                                    onClick={() => handleTagRemove(tagId)}
                                    className="tag-remove-btn"
                                >
                                    ×
                                </button>
                            )}
                        </span>
                    ) : null;
                })}
            </div>
            
            {/* Dropdown to add existing tags */}
            {!readOnly && availableTags.length > 0 && (
                <select 
                    onChange={(e) => handleTagAdd(e.target.value)}
                    value=""
                    className="tag-dropdown"
                >
                    <option value="">Add existing tag...</option>
                    {availableTags.map(tag => (
                        <option key={tag.id} value={tag.id}>
                            {tag.name}
                        </option>
                    ))}
                </select>
            )}
            
            {/* Create new tag */}
            {!readOnly && (
                <div className="tag-create-container">
                    <input 
                        type="text" 
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyPress={handleCreateTagKeyPress}
                        placeholder="Create new tag..."
                        disabled={isCreatingTag}
                        className="tag-create-input"
                    />
                    <button 
                        type="button"
                        onClick={handleCreateTag}
                        disabled={!newTagName.trim() || isCreatingTag}
                        className="tag-create-btn"
                    >
                        {isCreatingTag ? 'Creating...' : 'Create'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default TagSelector