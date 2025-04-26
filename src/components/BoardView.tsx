import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button, TextField, Box, Typography, Paper } from '@mui/material';
import { ArrowBack } from '@mui/icons-material'; // Import ArrowBack icon
import Column from './Column';
import { Board, Tag } from '../types';

interface BoardViewProps {
  board: Board;
  onAddColumn: (boardId: string, title: string) => void;
  onEditColumn: (boardId: string, columnId: string, title: string) => void;
  onDeleteColumn: (boardId: string, columnId: string) => void;
  onAddTask: (boardId: string, columnId: string, task: { title: string; description: string }) => void;
  onEditTask: (boardId: string, taskId: string, updates: { title?: string; description?: string; tags?: Tag[]; completed?: boolean }) => void;
  onDeleteTask: (boardId: string, taskId: string) => void;
  onDragEnd: (boardId: string, result: DropResult) => void;
  onBack: () => void; // Add new prop for back navigation
}

// Преобразуем массив в объект для оптимизации поиска
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // Базовые стили для карточки
  padding: '16px',
  margin: '0 0 16px 0',
  width: '300px',
  borderRadius: '8px',
  // Важные стили для предотвращения исчезновения
  visibility: isDragging ? 'visible' : undefined,
  userSelect: 'none',
  // Визуальные эффекты при перетаскивании
  backgroundColor: '#f5f5f5',
  boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.12)',
  // Слияние со стилями, предоставляемыми библиотекой
  ...draggableStyle,
});

const BoardView: React.FC<BoardViewProps> = ({
  board,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragEnd,
  onBack, // Destructure new prop
}) => {
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Удаляем класс при размонтировании компонента
    return () => {
      document.body.classList.remove('dragging');
    };
  }, []);

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      onAddColumn(board.id, newColumnTitle);
      setNewColumnTitle('');
    }
  };

  const handleDragEnd = (result: DropResult) => {
    console.log('Drag ended with result:', result);
    // Удаляем класс после завершения перетаскивания
    document.body.classList.remove('dragging');
    setIsDragging(false);
    onDragEnd(board.id, result);
  };

  // Обработчик начала перетаскивания
  const handleDragStart = (initial: any) => {
    console.log('Dragging started:', initial);
    // Добавляем класс при начале перетаскивания
    document.body.classList.add('dragging');
    setIsDragging(true);
  };

  return (
    <Box sx={{ padding: { xs: '10px', sm: '20px' }, maxWidth: '100%', overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Back to Boards
        </Button>
        <Typography variant="h4">{board.name}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="New Column"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          sx={{ mr: 2, mb: { xs: 1, sm: 0 }, minWidth: { xs: '100%', sm: '200px' } }}
        />
        <Button variant="contained" onClick={handleAddColumn}>
          Add Column
        </Button>
      </Box>
      <DragDropContext 
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                display: 'flex',
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                overflowX: 'auto',
                pb: 2,
                gap: 2
              }}
            >
              {board.columnOrder.map((columnId, index) => {
                const column = board.columns[columnId];
                return (
                  <Draggable key={columnId} draggableId={columnId} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
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
                      </div>
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
