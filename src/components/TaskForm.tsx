import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { Task } from '../types';

interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (task: { title: string; description: string }) => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit({ title, description });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={handleSubmit}>
          {initialTask ? 'Update' : 'Add'} Task
        </Button>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TaskForm;