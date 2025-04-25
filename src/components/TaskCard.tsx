import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Box, Typography, IconButton, Checkbox, Chip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import TaskForm from './TaskForm';
import TagSelector from './TagSelector';
import { Task, Tag } from '../types';

interface TaskCardProps {
  task: Task;
  index: number;
  onEditTask: (updates: { title?: string; description?: string; tags?: Tag[]; completed?: boolean }) => void;
  onDeleteTask: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEditTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleComplete = () => {
    onEditTask({ completed: !task.completed });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{ backgroundColor: 'white', p: 2, mb: 1, borderRadius: '4px', boxShadow: 1 }}
        >
          {isEditing ? (
            <TaskForm
              initialTask={task}
              onSubmit={(updates) => {
                onEditTask(updates);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Checkbox
                  checked={task.completed}
                  onChange={handleToggleComplete}
                />
                <Typography
                  variant="body1"
                  sx={{ textDecoration: task.completed ? 'line-through' : 'none', flexGrow: 1 }}
                >
                  {task.title}
                </Typography>
                <IconButton onClick={() => setIsEditing(true)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={onDeleteTask}>
                  <Delete />
                </IconButton>
              </Box>
              {task.description && (
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
              )}
              <Box sx={{ mt: 1 }}>
                <TagSelector
                  selectedTags={task.tags}
                  onChange={(tags) => onEditTask({ tags })}
                />
              </Box>
            </>
          )}
        </Box>
      )}
    </Draggable>
  );
};

export default TaskCard;