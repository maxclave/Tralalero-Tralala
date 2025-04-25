import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Board } from '../types';

interface BoardListProps {
  boards: Board[];
  onSelectBoard: (boardId: string) => void;
  onAddBoard: (name: string) => void;
  onEditBoard: (boardId: string, name: string) => void;
  onDeleteBoard: (boardId: string) => void;
}

const BoardList: React.FC<BoardListProps> = ({ boards, onSelectBoard, onAddBoard, onEditBoard, onDeleteBoard }) => {
  const [newBoardName, setNewBoardName] = useState('');
  const [editingBoard, setEditingBoard] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddBoard = () => {
    if (newBoardName.trim()) {
      onAddBoard(newBoardName);
      setNewBoardName('');
    }
  };

  const startEditing = (board: Board) => {
    setEditingBoard(board.id);
    setEditName(board.name);
  };

  const handleEditBoard = (boardId: string) => {
    if (editName.trim()) {
      onEditBoard(boardId, editName);
      setEditingBoard(null);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>Boards</Typography>
      <TextField
        label="New Board Name"
        value={newBoardName}
        onChange={(e) => setNewBoardName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleAddBoard} fullWidth>
        Add Board
      </Button>
      <List>
        {boards.map((board) => (
          <ListItem key={board.id} onClick={() => onSelectBoard(board.id)}>
            {editingBoard === board.id ? (
              <TextField
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => handleEditBoard(board.id)}
                autoFocus
              />
            ) : (
              <ListItemText primary={board.name} />
            )}
            <IconButton onClick={() => startEditing(board)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => onDeleteBoard(board.id)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default BoardList;