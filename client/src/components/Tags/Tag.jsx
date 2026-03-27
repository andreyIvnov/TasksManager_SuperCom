
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Stack
} from '@mui/material';
import {
  Delete as DeleteIcon,
  LocalOffer as TagIcon
} from '@mui/icons-material';

function Tag({ tagInfo, onDelete }) {
  return (
    <Card className="tag-card">
      <CardContent className="tag-card-content">
        <Stack spacing={1} alignItems="center" className="tag-card-stack">
          <TagIcon color="secondary" className="tag-icon" />
          <Typography 
            variant="h6" 
            component="h3" 
            textAlign="center"
            className="tag-name"
          >
            {tagInfo.name}
          </Typography>
          <Chip
            label={`Tag #${tagInfo.id}`}
            size="small"
            variant="outlined"
            color="secondary"
            className="tag-id-chip"
          />
        </Stack>
      </CardContent>
      <CardActions className="tag-actions">
        <IconButton
          onClick={() => onDelete(tagInfo.id)}
          color="error"
          size="small"
          className="tag-delete-button"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default Tag