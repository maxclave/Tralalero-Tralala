import React, {useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import {Box, Button, TextField, Typography} from '@mui/material';
import {ArrowBack} from '@mui/icons-material'; // Import ArrowBack icon
import Column from './Column';
import {Board, Tag} from '../types';

interface BoardViewProps {
	board: Board;
	onAddColumn: (boardId: string, title: string) => void;
	onEditColumn: (boardId: string, columnId: string, title: string) => void;
	onDeleteColumn: (boardId: string, columnId: string) => void;
	onAddTask: (boardId: string, columnId: string, task: { title: string; description: string }) => void;
	onEditTask: (boardId: string, taskId: string, updates: {
		title?: string;
		description?: string;
		tags?: Tag[];
		completed?: boolean
	}) => void;
	onDeleteTask: (boardId: string, taskId: string) => void;
	onDragEnd: (boardId: string, result: DropResult) => void;
	onBack: () => void;
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
	padding: '16px',
	margin: '0 0 16px 0',
	width: '300px',
	borderRadius: '8px',
	visibility: isDragging ? 'visible' : undefined,
	userSelect: 'none',
	backgroundColor: '#f5f5f5',
	boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.12)',
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
	
	const handleDragStart = (initial: any) => {
		console.log('Dragging started:', initial);
		document.body.classList.add('dragging');
		setIsDragging(true);
	};
	
	return (
		<Box sx={{padding: {xs: '10px', sm: '20px'}, maxWidth: '100%', overflowX: 'auto'}}>
			<Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
				<Button
					variant="outlined"
					startIcon={<ArrowBack/>}
					onClick={onBack}
					sx={{mr: 2}}>
					<Box sx={{
						display: {xs: 'none', sm: 'flex'},
						'@media (min-width: 600px)': {
							display: 'flex',
						}
					}}>
						Back to Boards
					</Box>
				</Button>
				<Typography variant="h4">{board.name}</Typography>
			</Box>
			<Box sx={{display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap'}}>
				<TextField
					label="New Column"
					value={newColumnTitle}
					onChange={(e) => setNewColumnTitle(e.target.value)}
					sx={{mr: 2, mb: {xs: 1, sm: 0}, minWidth: {xs: '100%', sm: '200px'}}}
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
								flexWrap: {xs: 'wrap', sm: 'nowrap'},
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
