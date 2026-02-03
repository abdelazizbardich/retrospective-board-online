export interface Ticket {
  id: string;
  content: string;
  columnId: string;
  status: 'created' | 'taken' | 'done' | 'rejected';
  votes: number;
  voters: string[];
  voterNames: string[];
  createdBy: string | null;
  createdByName: string | null;
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
  adminUserId: string | null;
  retroState: 'not-started' | 'in-progress' | 'stopped';
  createdAt: Date;
}
