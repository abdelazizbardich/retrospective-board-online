import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Board, Column, Ticket } from '../../models/board.model';
import { BoardService } from '../../services/board.service';
import { SocketService } from '../../services/socket.service';
import { ColumnComponent } from '../column/column.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, ColumnComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  board: Board | null = null;
  userId: string = '';
  showAddColumn = false;
  newColumnName = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private boardService: BoardService,
    private socketService: SocketService
  ) {
    // Generate a simple user ID (in a real app, this would come from authentication)
    this.userId = 'user-' + Math.random().toString(36).substr(2, 9);
  }

  ngOnInit(): void {
    // Connect to WebSocket
    this.socketService.connect();

    // Load the first board
    this.loadBoard();

    // Subscribe to real-time events
    this.subscribeToSocketEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.board) {
      this.socketService.leaveBoard(this.board.id);
    }
    this.socketService.disconnect();
  }

  loadBoard(): void {
    this.boardService.getBoards().subscribe(boards => {
      if (boards.length > 0) {
        this.board = boards[0];
        this.socketService.joinBoard(this.board.id);
      }
    });
  }

  subscribeToSocketEvents(): void {
    // Column events
    this.subscriptions.push(
      this.socketService.onColumnCreated().subscribe(data => {
        if (this.board && data.boardId === this.board.id) {
          this.board.columns.push(data.column);
        }
      })
    );

    this.subscriptions.push(
      this.socketService.onColumnDeleted().subscribe(data => {
        if (this.board && data.boardId === this.board.id) {
          this.board.columns = this.board.columns.filter(c => c.id !== data.columnId);
        }
      })
    );

    // Ticket events
    this.subscriptions.push(
      this.socketService.onTicketCreated().subscribe(data => {
        if (this.board && data.boardId === this.board.id) {
          const column = this.board.columns.find(c => c.id === data.columnId);
          if (column) {
            column.tickets.push(data.ticket);
          }
        }
      })
    );

    this.subscriptions.push(
      this.socketService.onTicketUpdated().subscribe(data => {
        if (this.board && data.boardId === this.board.id) {
          const column = this.board.columns.find(c => c.id === data.columnId);
          if (column) {
            const ticketIndex = column.tickets.findIndex(t => t.id === data.ticket.id);
            if (ticketIndex !== -1) {
              column.tickets[ticketIndex] = data.ticket;
            }
          }
        }
      })
    );

    this.subscriptions.push(
      this.socketService.onTicketDeleted().subscribe(data => {
        if (this.board && data.boardId === this.board.id) {
          const column = this.board.columns.find(c => c.id === data.columnId);
          if (column) {
            column.tickets = column.tickets.filter(t => t.id !== data.ticketId);
          }
        }
      })
    );

    this.subscriptions.push(
      this.socketService.onTicketMoved().subscribe(data => {
        if (this.board && data.boardId === this.board.id) {
          const sourceColumn = this.board.columns.find(c => c.id === data.sourceColumnId);
          const targetColumn = this.board.columns.find(c => c.id === data.targetColumnId);
          
          if (sourceColumn && targetColumn) {
            sourceColumn.tickets = sourceColumn.tickets.filter(t => t.id !== data.ticket.id);
            targetColumn.tickets.push(data.ticket);
          }
        }
      })
    );

    this.subscriptions.push(
      this.socketService.onTicketVoted().subscribe(data => {
        if (this.board && data.boardId === this.board.id) {
          const column = this.board.columns.find(c => c.id === data.columnId);
          if (column) {
            const ticket = column.tickets.find(t => t.id === data.ticket.id);
            if (ticket) {
              ticket.votes = data.ticket.votes;
              ticket.voters = data.ticket.voters;
            }
          }
        }
      })
    );

    this.subscriptions.push(
      this.socketService.onTicketUnvoted().subscribe(data => {
        if (this.board && data.boardId === this.board.id) {
          const column = this.board.columns.find(c => c.id === data.columnId);
          if (column) {
            const ticket = column.tickets.find(t => t.id === data.ticket.id);
            if (ticket) {
              ticket.votes = data.ticket.votes;
              ticket.voters = data.ticket.voters;
            }
          }
        }
      })
    );
  }

  onAddColumn(): void {
    if (this.board && this.newColumnName.trim()) {
      this.socketService.createColumn(this.board.id, this.newColumnName.trim());
      this.newColumnName = '';
      this.showAddColumn = false;
    }
  }

  onDeleteColumn(columnId: string): void {
    if (this.board) {
      this.socketService.deleteColumn(this.board.id, columnId);
    }
  }

  onAddTicket(event: { columnId: string, content: string }): void {
    if (this.board) {
      this.socketService.createTicket(this.board.id, event.columnId, event.content);
    }
  }

  onVoteTicket(event: { columnId: string, ticketId: string }): void {
    if (this.board) {
      this.socketService.voteTicket(this.board.id, event.columnId, event.ticketId, this.userId);
    }
  }

  onUnvoteTicket(event: { columnId: string, ticketId: string }): void {
    if (this.board) {
      this.socketService.unvoteTicket(this.board.id, event.columnId, event.ticketId, this.userId);
    }
  }

  onUpdateTicketStatus(event: { columnId: string, ticketId: string, status: string }): void {
    if (this.board) {
      this.socketService.updateTicket(
        this.board.id,
        event.columnId,
        event.ticketId,
        { status: event.status }
      );
    }
  }

  onDeleteTicket(event: { columnId: string, ticketId: string }): void {
    if (this.board) {
      this.socketService.deleteTicket(this.board.id, event.columnId, event.ticketId);
    }
  }

  onMoveTicket(event: { sourceColumnId: string, targetColumnId: string, ticketId: string }): void {
    if (this.board) {
      this.socketService.moveTicket(
        this.board.id,
        event.sourceColumnId,
        event.targetColumnId,
        event.ticketId
      );
    }
  }

  getConnectedLists(): string[] {
    return this.board ? this.board.columns.map(c => c.id) : [];
  }
}
