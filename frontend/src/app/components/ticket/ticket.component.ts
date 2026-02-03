import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/board.model';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent {
  @Input() ticket!: Ticket;
  @Input() userId!: string;
  @Input() isAdmin: boolean = false;
  @Output() voteTicket = new EventEmitter<string>();
  @Output() unvoteTicket = new EventEmitter<string>();
  @Output() updateStatus = new EventEmitter<string>();
  @Output() deleteTicket = new EventEmitter<string>();

  hasVoted(): boolean {
    return this.ticket.voters.includes(this.userId);
  }

  onVote(): void {
    if (this.hasVoted()) {
      this.unvoteTicket.emit(this.ticket.id);
    } else {
      this.voteTicket.emit(this.ticket.id);
    }
  }

  onStatusChange(newStatus: string): void {
    this.updateStatus.emit(newStatus);
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.deleteTicket.emit(this.ticket.id);
    }
  }

  getStatusClass(): string {
    return `status-${this.ticket.status}`;
  }

  getVotersDisplay(): string {
    if (this.ticket.voterNames && this.ticket.voterNames.length > 0) {
      return this.ticket.voterNames.join(', ');
    }
    return 'No votes yet';
  }
}
