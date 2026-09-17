import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import Column from "./Column";
import TaskDialog from "./TaskDialog";
import {
  fetchColumns,
  fetchTasksForColumn,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  toggleFavorite,
} from "../api/taskApi";

export default function Board() {
  const [columns, setColumns] = useState([]);
  const [tasksByColumn, setTasksByColumn] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [targetColumnId, setTargetColumnId] = useState(null);
  const [error, setError] = useState("");

  const loadTasksForColumn = useCallback(async (columnId) => {
    const tasks = await fetchTasksForColumn(columnId);
    setTasksByColumn((prev) => ({ ...prev, [columnId]: tasks }));
  }, []);

  const loadBoard = useCallback(async () => {
    try {
      const cols = await fetchColumns();
      setColumns(cols);
      await Promise.all(cols.map((c) => loadTasksForColumn(c.id)));
    } catch (e) {
      setError(e.message || "Failed to load board");
    }
  }, [loadTasksForColumn]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const openAddDialog = (columnId) => {
    setEditingTask(null);
    setTargetColumnId(columnId);
    setDialogOpen(true);
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setTargetColumnId(task.columnId);
    setDialogOpen(true);
  };

  const handleSave = async (form) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          name: form.name,
          description: form.description,
          deadline: form.deadline,
          columnId: editingTask.columnId,
          isFavorite: editingTask.isFavorite,
          imageUrl: form.imageUrl,
        });
        await loadTasksForColumn(editingTask.columnId);
      } else {
        await createTask({
          name: form.name,
          description: form.description,
          deadline: form.deadline,
          columnId: targetColumnId,
        });
        await loadTasksForColumn(targetColumnId);
      }
      setDialogOpen(false);
    } catch (e) {
      setError(e.message || "Failed to save task");
    }
  };

  const handleDelete = async (task) => {
    try {
      await deleteTask(task.id);
      await loadTasksForColumn(task.columnId);
    } catch (e) {
      setError(e.message || "Failed to delete task");
    }
  };

  const handleToggleFavorite = async (task) => {
    try {
      await toggleFavorite(task.id);
      await loadTasksForColumn(task.columnId);
    } catch (e) {
      setError(e.message || "Failed to update favorite");
    }
  };

  const handleMove = async (task, newColumnId) => {
    try {
      await moveTask(task.id, newColumnId);
      await loadTasksForColumn(task.columnId);
      if (newColumnId !== task.columnId) {
        await loadTasksForColumn(newColumnId);
      }
    } catch (e) {
      setError(e.message || "Failed to move task");
    }
  };

  const handleDropTask = (taskId, sourceColumnId, targetColumnId) => {
    if (sourceColumnId === targetColumnId) return;
    const task = (tasksByColumn[sourceColumnId] || []).find(
      (t) => String(t.id) === String(taskId)
    );
    if (!task) return;
    handleMove(task, targetColumnId);
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "grey.100" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Task Board
      </Typography>
      {error && (
        <Typography
          color="error"
          sx={{
            mb: 2,
            p: 1.5,
            bgcolor: "error.light",
            borderRadius: 1,
            color: "error.dark",
          }}
        >
          {error}
        </Typography>
      )}
      <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 2, alignItems: "flex-start" }}>
        {columns.map((column) => (
          <Box key={column.id}>
            <Column
              column={column}
              tasks={tasksByColumn[column.id] || []}
              columns={columns}
              onEdit={openEditDialog}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
              onMove={handleMove}
              onDropTask={handleDropTask}
            />
            <Button
              startIcon={<AddIcon />}
              size="small"
              sx={{ mt: 1 }}
              onClick={() => openAddDialog(column.id)}
            >
              Add task
            </Button>
          </Box>
        ))}
      </Stack>
      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialTask={editingTask}
      />
    </Box>
  );
}
