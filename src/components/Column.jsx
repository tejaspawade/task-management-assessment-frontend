import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TaskCard from "./TaskCard";

export default function Column({
  column,
  tasks,
  columns,
  onEdit,
  onDelete,
  onToggleFavorite,
  onMove,
  onDropTask,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const raw = e.dataTransfer.getData("application/json");
    if (!raw) return;
    try {
      const { taskId, sourceColumnId } = JSON.parse(raw);
      if (onDropTask) onDropTask(taskId, sourceColumnId, column.id);
    } catch {
      // ignore malformed drag data
    }
  };

  return (
    <Paper
      variant="outlined"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        p: 1.5,
        width: 300,
        flexShrink: 0,
        bgcolor: isDragOver ? "action.hover" : "grey.50",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        maxHeight: "80vh",
        border: isDragOver ? "2px dashed" : undefined,
        borderColor: isDragOver ? "primary.main" : undefined,
        transition: "box-shadow 0.2s ease-in-out, background-color 0.15s ease-in-out",
        "&:hover": {
          boxShadow: 2,
        },
      }}
      data-testid={`column-${column.id}`}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          pb: 1,
          mb: 1,
          borderBottom: "2px solid",
          borderColor: "divider",
          fontWeight: 600,
        }}
      >
        {column.name} ({tasks.length})
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflowY: "auto",
          pr: 0.5,
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columns={columns}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onMove={onMove}
          />
        ))}
        {tasks.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
              fontStyle: "italic",
              py: 2,
            }}
          >
            No tasks yet.
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
