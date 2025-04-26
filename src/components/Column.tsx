import React, {useState} from 'react';
import {Droppable} from 'react-beautiful-dnd';
import {Box, IconButton, TextField, Typography} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
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
	onEditTask: (boardId: string, taskId: string, updates: {
		title?: string;
		description?: string;
		tags?: Tag[];
		completed?: boolean
	}) => void;
	onDeleteTask: (boardId: string, taskId: string) => void;
	dragHandleProps?: any;
}

// Стили для области дропа задач
const getTaskListStyle = (isDraggingOver: boolean) => ({
	minHeight: '100px',
	padding: '8px',
	backgroundColor: isDraggingOver ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
	borderRadius: '4px',
	transition: 'background-color 0.2s ease',
	flexGrow: 1,
	overflow: 'hidden'
});

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
		<div
			style={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: '#f5f5f5',
				borderRadius: '8px',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					mb: 2,
					p: 2,
					cursor: 'grab',
					'&:active': {cursor: 'grabbing'}
				}}
				{...dragHandleProps}
			>
				{isEditing ? (
					<TextField
						value={columnTitle}
						onChange={(e) => setColumnTitle(e.target.value)}
						onBlur={handleEditColumn}
						autoFocus
						fullWidth
					/>
				) : (
					<Typography variant="h6" sx={{flexGrow: 1}}>{column.title}</Typography>
				)}
				<IconButton onClick={(e) => {
					e.stopPropagation();
					setIsEditing(true);
				}} size="small">
					<Edit/>
				</IconButton>
				<IconButton onClick={(e) => {
					e.stopPropagation();
					onDeleteColumn(boardId, column.id);
				}} size="small">
					<Delete/>
				</IconButton>
			</Box>
			<Box sx={{px: 2}}>
				<TaskForm
					onSubmit={(task) => onAddTask(boardId, column.id, task)}
				/>
			</Box>
			<Droppable droppableId={column.id} type="task">
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						style={getTaskListStyle(snapshot.isDraggingOver)}
						className={snapshot.isDraggingOver ? 'droppable-active' : ''}
					>
						{tasks.map((task, index) => (
							<TaskCard
								key={task.id}
								task={task}
								index={index}
								onEditTask={(updates) => onEditTask(boardId, task.id, updates)}
								onDeleteTask={() => onDeleteTask(boardId, task.id)}
								columnId={column.id}
							/>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</div>
	);
};

export default ColumnT;