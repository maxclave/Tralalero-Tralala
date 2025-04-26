import React, {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {DropResult} from 'react-beautiful-dnd';
import BoardList from './components/BoardList';
import BoardView from './components/BoardView';
import {Board, Tag, Task} from './types';

const App: React.FC = () => {
	const [boards, setBoards] = useState<Board[]>([]);
	const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
	
	useEffect(() => {
		const savedBoards = localStorage.getItem('boards');
		if (savedBoards) {
			setBoards(JSON.parse(savedBoards));
		}
	}, []);
	
	useEffect(() => {
		localStorage.setItem('boards', JSON.stringify(boards));
	}, [boards]);
	
	const addBoard = (name: string) => {
		const newBoard: Board = {
			id: uuidv4(),
			name,
			columns: {},
			tasks: {},
			columnOrder: [],
		};
		setBoards([...boards, newBoard]);
	};
	
	const editBoard = (boardId: string, name: string) => {
		setBoards(boards.map((board) =>
			board.id === boardId ? {...board, name} : board
		));
	};
	
	const deleteBoard = (boardId: string) => {
		setBoards(boards.filter((board) => board.id !== boardId));
		if (activeBoardId === boardId) {
			setActiveBoardId(null);
		}
	};
	
	const addColumn = (boardId: string, title: string) => {
		const columnId = uuidv4();
		setBoards(boards.map((board) =>
			board.id === boardId
				? {
					...board,
					columns: {
						...board.columns,
						[columnId]: {id: columnId, title, taskIds: []},
					},
					columnOrder: [...board.columnOrder, columnId],
				}
				: board
		));
	};
	
	const editColumn = (boardId: string, columnId: string, title: string) => {
		setBoards(boards.map((board) =>
			board.id === boardId
				? {
					...board,
					columns: {
						...board.columns,
						[columnId]: {...board.columns[columnId], title},
					},
				}
				: board
		));
	};
	
	const deleteColumn = (boardId: string, columnId: string) => {
		setBoards(boards.map((board) =>
			board.id === boardId
				? {
					...board,
					columns: Object.fromEntries(
						Object.entries(board.columns).filter(([id]) => id !== columnId)
					),
					columnOrder: board.columnOrder.filter((id) => id !== columnId),
					tasks: Object.fromEntries(
						Object.entries(board.tasks).filter(
							([taskId]) => !board.columns[columnId].taskIds.includes(taskId)
						)
					),
				}
				: board
		));
	};
	
	const addTask = (boardId: string, columnId: string, task: { title: string; description: string }) => {
		const taskId = uuidv4();
		const newTask: Task = {
			id: taskId,
			title: task.title,
			description: task.description,
			tags: [],
			completed: false,
		};
		setBoards(boards.map((board) =>
			board.id === boardId
				? {
					...board,
					columns: {
						...board.columns,
						[columnId]: {
							...board.columns[columnId],
							taskIds: [...board.columns[columnId].taskIds, taskId],
						},
					},
					tasks: {
						...board.tasks,
						[taskId]: newTask,
					},
				}
				: board
		));
	};
	
	const editTask = (
		boardId: string,
		taskId: string,
		updates: { title?: string; description?: string; tags?: Tag[]; completed?: boolean }
	) => {
		setBoards(boards.map((board) =>
			board.id === boardId
				? {
					...board,
					tasks: {
						...board.tasks,
						[taskId]: {
							...board.tasks[taskId],
							...updates,
						},
					},
				}
				: board
		));
	};
	
	const deleteTask = (boardId: string, taskId: string) => {
		setBoards(boards.map((board) =>
			board.id === boardId
				? {
					...board,
					columns: Object.fromEntries(
						Object.entries(board.columns).map(([columnId, column]) => [
							columnId,
							{
								...column,
								taskIds: column.taskIds.filter((id) => id !== taskId),
							},
						])
					),
					tasks: Object.fromEntries(
						Object.entries(board.tasks).filter(([id]) => id !== taskId)
					),
				}
				: board
		));
	};
	
	const handleDragEnd = (boardId: string, result: DropResult) => {
		const {source, destination, draggableId, type} = result;
		
		if (!destination) {
			console.log('No destination');
			return;
		}
		
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			console.log('Dropped in the same position');
			return;
		}
		
		if (type === 'column') {
			console.log('Reordering column');
			const board = boards.find(b => b.id === boardId);
			if (!board) return;
			
			const newColumnOrder = Array.from(board.columnOrder);
			newColumnOrder.splice(source.index, 1);
			newColumnOrder.splice(destination.index, 0, draggableId);
			
			const updatedBoards = boards.map(b =>
				b.id === boardId
					? {...b, columnOrder: newColumnOrder}
					: b
			);
			
			console.log('New order:', newColumnOrder);
			setBoards(updatedBoards);
			return;
		}
		
		const sourceColumnId = source.droppableId;
		const destinationColumnId = destination.droppableId;
		
		const board = boards.find(b => b.id === boardId);
		if (!board) return;
		
		if (sourceColumnId === destinationColumnId) {
			const column = board.columns[sourceColumnId];
			const newTaskIds = Array.from(column.taskIds);
			newTaskIds.splice(source.index, 1);
			newTaskIds.splice(destination.index, 0, draggableId);
			
			const updatedBoards = boards.map(b =>
				b.id === boardId
					? {
						...b,
						columns: {
							...b.columns,
							[sourceColumnId]: {
								...b.columns[sourceColumnId],
								taskIds: newTaskIds,
							},
						},
					}
					: b
			);
			
			setBoards(updatedBoards);
			return;
		}
		
		const sourceColumn = board.columns[sourceColumnId];
		const destinationColumn = board.columns[destinationColumnId];
		const sourceTaskIds = Array.from(sourceColumn.taskIds);
		const destinationTaskIds = Array.from(destinationColumn.taskIds);
		
		sourceTaskIds.splice(source.index, 1);
		destinationTaskIds.splice(destination.index, 0, draggableId);
		
		const updatedBoards = boards.map(b =>
			b.id === boardId
				? {
					...b,
					columns: {
						...b.columns,
						[sourceColumnId]: {
							...b.columns[sourceColumnId],
							taskIds: sourceTaskIds,
						},
						[destinationColumnId]: {
							...b.columns[destinationColumnId],
							taskIds: destinationTaskIds,
						},
					},
				}
				: b
		);
		
		setBoards(updatedBoards);
	};
	
	const activeBoard = boards.find((board) => board.id === activeBoardId);
	
	return (
		<div>
			{activeBoard ? (
				<BoardView
					board={activeBoard}
					onAddColumn={addColumn}
					onEditColumn={editColumn}
					onDeleteColumn={deleteColumn}
					onAddTask={addTask}
					onEditTask={editTask}
					onDeleteTask={deleteTask}
					onDragEnd={handleDragEnd}
					onBack={() => setActiveBoardId(null)}
				/>
			) : (
				<BoardList
					boards={boards}
					onSelectBoard={setActiveBoardId}
					onAddBoard={addBoard}
					onEditBoard={editBoard}
					onDeleteBoard={deleteBoard}
				/>
			)}
		</div>
	);
};

export default App;