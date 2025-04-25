import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import {Column, Tag, Task} from '../types';

interface ColumnProps {
  boardId: string;
  column: Column;
  tasks: Task[];
  onEditColumn: (boardId: string, columnId: string, title: string) => void;
  onDeleteColumn: (boardId: string, columnId: string) => void;
  onAddTask: (boardId: string, columnId: string, task: { title: string; description: string }) => void;
  onEditTask: (boardId: string, taskId: string, updates: { title?: string; description?: string; tags?: Tag[]; completed?: boolean }) => void;
  onDeleteTask: (boardId: string, taskId: string) => void;
  dragHandleProps?: any;
}

const ColumnT: React.FC<ColumnProps> = ({
  boardId,
  column,
  tasks,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  dragHandleProps,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  const handleEditColumn = () => {
    if (columnTitle.trim()) {
      onEditColumn(boardId, column.id, columnTitle);
      setIsEditing(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px', p: 2, width: '300px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }} {...dragHandleProps}>
        {isEditing ? (
          <TextField
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
            onBlur={handleEditColumn}
            autoFocus
            fullWidth
          />
        ) : (
          <Typography variant="h6">{column.title}</Typography>
        )}
        <IconButton onClick={() => setIsEditing(true)}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDeleteColumn(boardId, column.id)}>
          <Delete />
        </IconButton>
      </Box>
      <TaskForm
        onSubmit={(task) => onAddTask(boardId, column.id, task)}
      />
      <Droppable droppableId={column.id} type="task">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ minHeight: '100px' }}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEditTask={(updates) => onEditTask(boardId, task.id, updates)}
                onDeleteTask={() => onDeleteTask(boardId, task.id)}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );
};

export default ColumnT;