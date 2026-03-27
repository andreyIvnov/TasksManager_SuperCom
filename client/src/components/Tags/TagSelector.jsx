import { useState, useMemo, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { createTag } from "../../services/TagsApi"
import {
  Box,
  Chip,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';

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
        <Box sx={{ minWidth: 0 }}>
            {/* Selected Tags */}
            <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 0.5, 
                mb: readOnly ? 0 : 2 
            }}>
                {selectedTagIds.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        {readOnly ? 'No tags' : 'No tags selected'}
                    </Typography>
                ) : (
                    selectedTagIds.map(tagId => {
                        const tag = allTags.find(t => t.id === tagId);
                        return tag ? (
                            <Chip
                                key={tagId}
                                label={tag.name}
                                size="small"
                                onDelete={readOnly ? undefined : () => handleTagRemove(tagId)}
                                deleteIcon={<CloseIcon />}
                                sx={{
                                    backgroundColor: 'secondary.light',
                                    color: 'secondary.contrastText',
                                    '& .MuiChip-deleteIcon': {
                                        color: 'secondary.main',
                                        '&:hover': {
                                            color: 'secondary.dark',
                                        },
                                    },
                                }}
                            />
                        ) : null;
                    })
                )}
            </Box>
            
            {!readOnly && (
                <Stack spacing={2}>
                    {/* Dropdown to add existing tags */}
                    {availableTags.length > 0 && (
                        <FormControl size="small" fullWidth>
                            <InputLabel>Add existing tag</InputLabel>
                            <Select
                                label="Add existing tag"
                                value=""
                                onChange={(e) => handleTagAdd(e.target.value)}
                            >
                                {availableTags.map(tag => (
                                    <MenuItem key={tag.id} value={tag.id}>
                                        {tag.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    
                    {/* Create new tag */}
                    <Box sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        alignItems: 'flex-start' 
                    }}>
                        <TextField
                            size="small"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            onKeyPress={handleCreateTagKeyPress}
                            placeholder="Create new tag..."
                            disabled={isCreatingTag}
                            fullWidth
                            variant="outlined"
                        />
                        <Button
                            variant="outlined"
                            onClick={handleCreateTag}
                            disabled={!newTagName.trim() || isCreatingTag}
                            startIcon={isCreatingTag ? <CircularProgress size={16} /> : <AddIcon />}
                            size="small"
                            sx={{ 
                                textTransform: 'none',
                                minWidth: 'auto',
                                px: 2 
                            }}
                        >
                            {isCreatingTag ? 'Creating' : 'Create'}
                        </Button>
                    </Box>
                </Stack>
            )}
        </Box>
    );
}

export default TagSelector