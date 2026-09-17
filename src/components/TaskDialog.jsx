import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const emptyForm = { name: "", description: "", deadline: "", imageUrl: "" };

export default function TaskDialog({ open, onClose, onSave, initialTask }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialTask) {
      setForm({
        name: initialTask.name || "",
        description: initialTask.description || "",
        deadline: initialTask.deadline ? initialTask.deadline.slice(0, 10) : "",
        imageUrl: initialTask.imageUrl || "",
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [initialTask, open]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, imageUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    onSave({
      ...form,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialTask ? "Edit Task" : "Add Task"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={handleChange("name")}
            error={Boolean(error)}
            helperText={error}
            autoFocus
            fullWidth
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange("description")}
            multiline
            minRows={3}
            fullWidth
          />
          <TextField
            label="Deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange("deadline")}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Button component="label" variant="outlined">
            Attach Image
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </Button>
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Attachment preview"
              style={{ maxHeight: 120, objectFit: "cover" }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
