import React, {useState} from 'react';
import {Draggable} from 'react-beautiful-dnd';
import {Box, Checkbox, IconButton, Typography} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import TaskForm from './TaskForm';
import TagSelector from './TagSelector';
import {Tag, Task} from '../types';

interface TaskCardProps {
	task: Task;
	index: number;
	onEditTask: (updates: { title?: string; description?: string; tags?: Tag[]; completed?: boolean }) => void;
	onDeleteTask: () => void;
	columnId?: string;
}

// Функция стилизации задачи для предотвращения исчезновения при перетаскивании
const getTaskStyle = (isDragging: boolean, draggableStyle: any) => {
	// Базовые стили
	const baseStyle = {
		backgroundColor: 'white',
		padding: '16px',
		marginBottom: '8px',
		borderRadius: '4px',
		boxShadow: isDragging ? '0 5px 10px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.12)',
		userSelect: 'none' as 'none',
		position: isDragging ? 'relative' : 'static',
		zIndex: isDragging ? 9999 : 'auto',
	};
	
	// Если элемент перетаскивается, установим фиксированную позицию
	if (isDragging) {
		return {
			...baseStyle,
			...draggableStyle,
			top: draggableStyle.top,
			left: draggableStyle.left,
			transform: draggableStyle.transform,
			width: '300px',
			opacity: 0.9,
		};
	}
	
	// Обычные стили, когда элемент не перетаскивается
	return {
		...baseStyle,
		...draggableStyle,
	};
};

const TaskCard: React.FC<TaskCardProps> = ({task, index, onEditTask, onDeleteTask, columnId}) => {
	const [isEditing, setIsEditing] = useState(false);
	
	const handleToggleComplete = () => {
		onEditTask({completed: !task.completed});
	};
	
	return (
		<Draggable draggableId={task.id} index={index} key={task.id}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={getTaskStyle(snapshot.isDragging, provided.draggableProps.style || {})}
					className={snapshot.isDragging ? 'dragging-task' : ''}
					data-task-id={task.id}
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
						<div style={{position: 'relative'}}>
							<Box sx={{display: 'flex', alignItems: 'flex-start', mb: 1}}>
								<Checkbox
									checked={task.completed}
									onChange={handleToggleComplete}
									sx={{pt: 0, mr: 1}}
								/>
								<Typography
									variant="body1"
									sx={{
										textDecoration: task.completed ? 'line-through' : 'none',
										flexGrow: 1,
										wordBreak: 'break-word'
									}}
								>
									{task.title}
								</Typography>
								<Box sx={{display: 'flex', ml: 1}}>
									<IconButton size="small" onClick={() => setIsEditing(true)}>
										<Edit fontSize="small"/>
									</IconButton>
									<IconButton size="small" onClick={onDeleteTask}>
										<Delete fontSize="small"/>
									</IconButton>
								</Box>
							</Box>
							{task.description && (
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{pl: 4, wordBreak: 'break-word'}}
								>
									{task.description}
								</Typography>
							)}
							<Box sx={{mt: 1}}>
								<TagSelector
									selectedTags={task.tags}
									onChange={(tags) => onEditTask({tags})}
								/>
							</Box>
						</div>
					)}
				</div>
			)}
		</Draggable>
	);
};

export default TaskCard;