import React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TaskCard({ task, columns, onEdit, onDelete, onToggleFavorite, onMove }) {
  const deadlineLabel = task.deadline
    ? new Date(task.deadline).toLocaleDateString()
    : null;

  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ taskId: task.id, sourceColumnId: task.columnId })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <Card
      variant="outlined"
      draggable
      onDragStart={handleDragStart}
      sx={{
        borderRadius: 2,
        cursor: "grab",
        transition: "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
        },
        "&:active": {
          cursor: "grabbing",
        },
      }}
      data-testid={`task-card-${task.id}`}
    >
      {task.imageUrl && (
        <img
          src={task.imageUrl}
          alt={task.name}
          style={{
            width: "100%",
            height: 120,
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
      <CardContent sx={{ pb: 1 }}>
        <Typography
          component={Link}
          to={`/tasks/${task.id}`}
          variant="subtitle1"
          sx={{ fontWeight: 600, textDecoration: "none", color: "inherit" }}
        >
          {task.name}
        </Typography>
        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {task.description.length > 80
              ? `${task.description.slice(0, 80)}...`
              : task.description}
          </Typography>
        )}
        {deadlineLabel && (
          <Chip label={`Due ${deadlineLabel}`} size="small" sx={{ mt: 1 }} />
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", pt: 0 }}>
        <div>
          <IconButton
            aria-label={task.isFavorite ? "Unfavorite task" : "Favorite task"}
            size="small"
            onClick={() => onToggleFavorite(task)}
          >
            {task.isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
          </IconButton>
          <IconButton aria-label="Edit task" size="small" onClick={() => onEdit(task)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="Delete task" size="small" onClick={() => onDelete(task)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
        {columns && columns.length > 1 && (
          <Select
            size="small"
            value={task.columnId}
            onChange={(e) => onMove(task, e.target.value)}
            inputProps={{ "aria-label": "Move task to column" }}
          >
            {columns.map((col) => (
              <MenuItem key={col.id} value={col.id}>
                {col.name}
              </MenuItem>
            ))}
          </Select>
        )}
      </CardActions>
    </Card>
  );
}
