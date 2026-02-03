export interface Ticket {
  id: string;
  content: string;
  columnId: string;
  status: 'created' | 'taken' | 'done' | 'rejected';
  votes: number;
  voters: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  name: string;
  boardId: string;
  tickets: Ticket[];
  createdAt: Date;
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  createdAt: Date;
}
