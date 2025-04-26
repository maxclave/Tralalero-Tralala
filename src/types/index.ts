export interface Tag {
	id: string;
	name: string;
	color: string;
}

export interface Task {
	id: string;
	title: string;
	description: string;
	tags: Tag[];
	completed: boolean;
}

export interface Column {
	id: string;
	title: string;
	taskIds: string[];
}

export interface Board {
	id: string;
	name: string;
	columns: { [key: string]: Column };
	tasks: { [key: string]: Task };
	columnOrder: string[];
}