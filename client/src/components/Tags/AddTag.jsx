import { useState } from "react"
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

function AddTag({ onSave }) {
    const [newTagName, setNewTagName] = useState("")

    const handleSave = async () => {
        if (newTagName.trim()) {
            await onSave({ name: newTagName });
            setNewTagName(""); // Clear input after saving
        }
    }

    return (
        <Paper sx={{ p: 3, bgcolor: 'primary.50' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Add New Tag
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <TextField
                    label="Tag Name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    size="small"
                    fullWidth
                    inputProps={{ maxLength: 25 }}
                    helperText={`${newTagName.length}/25 characters`}
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!newTagName.trim()}
                    startIcon={<AddIcon />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        minWidth: 100
                    }}
                >
                    Create
                </Button>
            </Stack>
        </Paper>
    )
}

export default AddTag