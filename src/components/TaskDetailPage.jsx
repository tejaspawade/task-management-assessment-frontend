import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/tasks/${taskId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Task not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setTask(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Button component={Link} to="/" sx={{ mb: 2 }}>
        ← Back to board
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {!error && !task && <Typography>Loading...</Typography>}
      {task && (
        <>
          <Typography variant="h4" gutterBottom>
            {task.name}
            {task.isFavorite && <Chip label="Favorite" color="warning" size="small" sx={{ ml: 1 }} />}
          </Typography>
          {task.imageUrl && (
            <img
              src={task.imageUrl}
              alt={task.name}
              style={{ maxWidth: "100%", maxHeight: 300, objectFit: "cover", marginBottom: 16 }}
            />
          )}
          <Typography variant="body1" paragraph>
            {task.description || "No description provided."}
          </Typography>
          {task.deadline && (
            <Typography variant="body2" color="text.secondary">
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
