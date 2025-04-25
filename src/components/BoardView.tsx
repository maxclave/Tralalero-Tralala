import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button, TextField, Box, Typography } from '@mui/material';
import Column from './Column';
import {Board, Tag} from '../types';

interface BoardViewProps {
  board: Board;
  onAddColumn: (boardId: string, title: string) => void;
  onEditColumn: (boardId: string, columnId: string, title: string) => void;
  onDeleteColumn: (boardId: string, columnId: string) => void;
  onAddTask: (boardId: string, columnId: string, task: { title: string; description: string }) => void;
  onEditTask: (boardId: string, taskId: string, updates: { title?: string; description?: string; tags?: Tag[]; completed?: boolean }) => void;
  onDeleteTask: (boardId: string, taskId: string) => void;
  onDragEnd: (boardId: string, result: DropResult) => void;
}

const BoardView: React.FC<BoardViewProps> = ({
  board,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragEnd,
}) => {
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      onAddColumn(board.id, newColumnTitle);
      setNewColumnTitle('');
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>{board.name}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          label="New Column"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddColumn}>
          Add Column
        </Button>
      </Box>
      <DragDropContext onDragEnd={(result) => onDragEnd(board.id, result)}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided) => (
            <Box
              sx={{ display: 'flex', overflowX: 'auto', pb: 2 }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {board.columnOrder.map((columnId, index) => {
                const column = board.columns[columnId];
                return (
                  <Draggable key={columnId} draggableId={columnId} index={index}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ minWidth: '300px', mr: 2 }}
                      >
                        <Column
                          boardId={board.id}
                          column={column}
                          tasks={column.taskIds.map((taskId) => board.tasks[taskId])}
                          onEditColumn={onEditColumn}
                          onDeleteColumn={onDeleteColumn}
                          onAddTask={onAddTask}
                          onEditTask={onEditTask}
                          onDeleteTask={onDeleteTask}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </Box>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default BoardView;