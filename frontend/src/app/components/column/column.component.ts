import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { Column, Ticket } from '../../models/board.model';
import { TicketComponent } from '../ticket/ticket.component';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, TicketComponent],
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent {
  @Input() column!: Column;
  @Input() boardId!: string;
  @Input() userId!: string;
  @Output() addTicket = new EventEmitter<{ columnId: string, content: string }>();
  @Output() voteTicket = new EventEmitter<{ columnId: string, ticketId: string }>();
  @Output() unvoteTicket = new EventEmitter<{ columnId: string, ticketId: string }>();
  @Output() updateTicketStatus = new EventEmitter<{ columnId: string, ticketId: string, status: string }>();
  @Output() deleteTicket = new EventEmitter<{ columnId: string, ticketId: string }>();
  @Output() moveTicket = new EventEmitter<{ sourceColumnId: string, targetColumnId: string, ticketId: string }>();
  @Output() deleteColumn = new EventEmitter<string>();

  showAddTicket = false;
  newTicketContent = '';

  onAddTicket(): void {
    if (this.newTicketContent.trim()) {
      this.addTicket.emit({
        columnId: this.column.id,
        content: this.newTicketContent.trim()
      });
      this.newTicketContent = '';
      this.showAddTicket = false;
    }
  }

  onVoteTicket(ticketId: string): void {
    this.voteTicket.emit({ columnId: this.column.id, ticketId });
  }

  onUnvoteTicket(ticketId: string): void {
    this.unvoteTicket.emit({ columnId: this.column.id, ticketId });
  }

  onUpdateStatus(ticketId: string, status: string): void {
    this.updateTicketStatus.emit({ columnId: this.column.id, ticketId, status });
  }

  onDeleteTicket(ticketId: string): void {
    this.deleteTicket.emit({ columnId: this.column.id, ticketId });
  }

  onDeleteColumn(): void {
    if (confirm(`Are you sure you want to delete the column "${this.column.name}"?`)) {
      this.deleteColumn.emit(this.column.id);
    }
  }

  drop(event: CdkDragDrop<Ticket[]>): void {
    if (event.previousContainer !== event.container) {
      const ticket = event.previousContainer.data[event.previousIndex];
      const sourceColumnId = ticket.columnId;
      const targetColumnId = this.column.id;
      
      this.moveTicket.emit({
        sourceColumnId,
        targetColumnId,
        ticketId: ticket.id
      });
    }
  }

  getDropListIds(): string[] {
    return [this.column.id];
  }
}
