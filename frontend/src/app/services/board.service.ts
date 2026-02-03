import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board, Column, Ticket } from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Board operations
  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.apiUrl}/boards`);
  }

  getBoard(boardId: string): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/boards/${boardId}`);
  }

  createBoard(name: string): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}/boards`, { name });
  }

  deleteBoard(boardId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/boards/${boardId}`);
  }

  // Column operations
  createColumn(boardId: string, name: string): Observable<Column> {
    return this.http.post<Column>(`${this.apiUrl}/boards/${boardId}/columns`, { name });
  }

  updateColumn(boardId: string, columnId: string, name: string): Observable<Column> {
    return this.http.put<Column>(`${this.apiUrl}/boards/${boardId}/columns/${columnId}`, { name });
  }

  deleteColumn(boardId: string, columnId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/boards/${boardId}/columns/${columnId}`);
  }

  // Ticket operations
  createTicket(boardId: string, columnId: string, content: string): Observable<Ticket> {
    return this.http.post<Ticket>(
      `${this.apiUrl}/boards/${boardId}/columns/${columnId}/tickets`,
      { content }
    );
  }

  updateTicket(boardId: string, columnId: string, ticketId: string, updates: any): Observable<Ticket> {
    return this.http.put<Ticket>(
      `${this.apiUrl}/boards/${boardId}/columns/${columnId}/tickets/${ticketId}`,
      updates
    );
  }

  deleteTicket(boardId: string, columnId: string, ticketId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/boards/${boardId}/columns/${columnId}/tickets/${ticketId}`
    );
  }

  moveTicket(boardId: string, ticketId: string, sourceColumnId: string, targetColumnId: string): Observable<Ticket> {
    return this.http.post<Ticket>(
      `${this.apiUrl}/boards/${boardId}/tickets/${ticketId}/move`,
      { sourceColumnId, targetColumnId }
    );
  }

  voteTicket(boardId: string, columnId: string, ticketId: string, userId: string): Observable<Ticket> {
    return this.http.post<Ticket>(
      `${this.apiUrl}/boards/${boardId}/columns/${columnId}/tickets/${ticketId}/vote`,
      { userId }
    );
  }

  unvoteTicket(boardId: string, columnId: string, ticketId: string, userId: string): Observable<Ticket> {
    return this.http.request<Ticket>(
      'DELETE',
      `${this.apiUrl}/boards/${boardId}/columns/${columnId}/tickets/${ticketId}/vote`,
      { body: { userId } }
    );
  }
}
