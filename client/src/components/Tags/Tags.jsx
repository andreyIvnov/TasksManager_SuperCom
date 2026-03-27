import { createTag, deleteTag } from '../../services/TagsApi'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid
} from '@mui/material';

import Tag from './Tag'
import AddTag from './AddTag'
import { HttpStatusCode } from 'axios'
import '../../styles/Tags.css';

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
        <Box className="tags-container">
            <Typography variant="h4" component="h1" className="tags-title">
                Tags
            </Typography>
            
            <Stack spacing={3} className="tags-list-container">
                <AddTag onSave={addNewTag} />
                
                <Paper sx={{ p: 3, flexGrow: 1 }} className="tags-list-paper">
                    <Typography variant="h6" className="tags-list-title">
                        Tag List ({storedTags.length})
                    </Typography>
                    
                    {storedTags.length === 0 ? (
                        <Typography variant="body2" className="tags-empty-message">
                            No tags created yet. Use the form above to create your first tag.
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {storedTags.map((tag) => (
                                <Grid xs={12} sm={6} md={4} lg={3} key={tag.id}>
                                    <Tag tagInfo={tag} onDelete={removeTag} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>
            </Stack>
        </Box>
    )
}

export default Tags