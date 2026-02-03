import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  private connected = false;

  // Subjects for real-time events
  private columnCreated = new Subject<any>();
  private columnUpdated = new Subject<any>();
  private columnDeleted = new Subject<any>();
  private ticketCreated = new Subject<any>();
  private ticketUpdated = new Subject<any>();
  private ticketDeleted = new Subject<any>();
  private ticketMoved = new Subject<any>();
  private ticketVoted = new Subject<any>();
  private ticketUnvoted = new Subject<any>();
  private adminSet = new Subject<any>();
  private retroStarted = new Subject<any>();
  private retroStopped = new Subject<any>();
  private retroError = new Subject<any>();
  private userNamesToggled = new Subject<any>();

  constructor() {}

  connect(serverUrl: string = 'http://localhost:3000'): void {
    if (this.connected) return;

    this.socket = io(serverUrl);
    this.connected = true;

    this.socket.on('column-created', (data) => {
      this.columnCreated.next(data);
    });

    this.socket.on('column-updated', (data) => {
      this.columnUpdated.next(data);
    });

    this.socket.on('column-deleted', (data) => {
      this.columnDeleted.next(data);
    });

    this.socket.on('ticket-created', (data) => {
      this.ticketCreated.next(data);
    });

    this.socket.on('ticket-updated', (data) => {
      this.ticketUpdated.next(data);
    });

    this.socket.on('ticket-deleted', (data) => {
      this.ticketDeleted.next(data);
    });

    this.socket.on('ticket-moved', (data) => {
      this.ticketMoved.next(data);
    });

    this.socket.on('ticket-voted', (data) => {
      this.ticketVoted.next(data);
    });

    this.socket.on('ticket-unvoted', (data) => {
      this.ticketUnvoted.next(data);
    });

    this.socket.on('admin-set', (data) => {
      this.adminSet.next(data);
    });

    this.socket.on('retro-started', (data) => {
      this.retroStarted.next(data);
    });

    this.socket.on('retro-stopped', (data) => {
      this.retroStopped.next(data);
    });

    this.socket.on('retro-error', (data) => {
      this.retroError.next(data);
    });

    this.socket.on('user-names-toggled', (data) => {
      this.userNamesToggled.next(data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
    }
  }

  joinBoard(boardId: string): void {
    this.socket.emit('join-board', boardId);
  }

  leaveBoard(boardId: string): void {
    this.socket.emit('leave-board', boardId);
  }

  createColumn(boardId: string, name: string): void {
    this.socket.emit('create-column', { boardId, name });
  }

  updateColumn(boardId: string, columnId: string, name: string): void {
    this.socket.emit('update-column', { boardId, columnId, name });
  }

  deleteColumn(boardId: string, columnId: string): void {
    this.socket.emit('delete-column', { boardId, columnId });
  }

  createTicket(boardId: string, columnId: string, content: string, createdBy?: string, createdByName?: string): void {
    this.socket.emit('create-ticket', { boardId, columnId, content, createdBy, createdByName });
  }

  updateTicket(boardId: string, columnId: string, ticketId: string, updates: any): void {
    this.socket.emit('update-ticket', { boardId, columnId, ticketId, updates });
  }

  deleteTicket(boardId: string, columnId: string, ticketId: string): void {
    this.socket.emit('delete-ticket', { boardId, columnId, ticketId });
  }

  moveTicket(boardId: string, sourceColumnId: string, targetColumnId: string, ticketId: string): void {
    this.socket.emit('move-ticket', { boardId, sourceColumnId, targetColumnId, ticketId });
  }

  voteTicket(boardId: string, columnId: string, ticketId: string, userId: string, userName?: string): void {
    this.socket.emit('vote-ticket', { boardId, columnId, ticketId, userId, userName });
  }

  unvoteTicket(boardId: string, columnId: string, ticketId: string, userId: string, userName?: string): void {
    this.socket.emit('unvote-ticket', { boardId, columnId, ticketId, userId, userName });
  }

  setAdmin(boardId: string, userId: string): void {
    this.socket.emit('set-admin', { boardId, userId });
  }

  startRetro(boardId: string, userId: string): void {
    this.socket.emit('start-retro', { boardId, userId });
  }

  stopRetro(boardId: string, userId: string): void {
    this.socket.emit('stop-retro', { boardId, userId });
  }

  toggleUserNames(boardId: string, userId: string): void {
    this.socket.emit('toggle-user-names', { boardId, userId });
  }

  // Observable getters
  onColumnCreated(): Observable<any> {
    return this.columnCreated.asObservable();
  }

  onColumnUpdated(): Observable<any> {
    return this.columnUpdated.asObservable();
  }

  onColumnDeleted(): Observable<any> {
    return this.columnDeleted.asObservable();
  }

  onTicketCreated(): Observable<any> {
    return this.ticketCreated.asObservable();
  }

  onTicketUpdated(): Observable<any> {
    return this.ticketUpdated.asObservable();
  }

  onTicketDeleted(): Observable<any> {
    return this.ticketDeleted.asObservable();
  }

  onTicketMoved(): Observable<any> {
    return this.ticketMoved.asObservable();
  }

  onTicketVoted(): Observable<any> {
    return this.ticketVoted.asObservable();
  }

  onTicketUnvoted(): Observable<any> {
    return this.ticketUnvoted.asObservable();
  }

  onAdminSet(): Observable<any> {
    return this.adminSet.asObservable();
  }

  onRetroStarted(): Observable<any> {
    return this.retroStarted.asObservable();
  }

  onRetroStopped(): Observable<any> {
    return this.retroStopped.asObservable();
  }

  onRetroError(): Observable<any> {
    return this.retroError.asObservable();
  }

  onUserNamesToggled(): Observable<any> {
    return this.userNamesToggled.asObservable();
  }
}
