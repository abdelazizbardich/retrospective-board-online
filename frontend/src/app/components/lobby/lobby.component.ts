import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { BoardService } from '../../services/board.service';

const MIN_USERNAME_LENGTH = 2;
const MAX_USERNAME_LENGTH = 20;

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {
  username: string = '';
  roomName: string = '';
  roomCode: string = '';
  mode: 'create' | 'join' | null = null;
  errorMessage: string = '';
  readonly maxUsernameLength = MAX_USERNAME_LENGTH;

  constructor(
    private userService: UserService,
    private boardService: BoardService,
    private router: Router
  ) {}

  onSubmit(): void {
    const trimmedUsername = this.username.trim();
    
    if (!trimmedUsername) {
      this.errorMessage = 'Please enter a username';
      return;
    }

    if (trimmedUsername.length < MIN_USERNAME_LENGTH) {
      this.errorMessage = `Username must be at least ${MIN_USERNAME_LENGTH} characters`;
      return;
    }

    if (trimmedUsername.length > MAX_USERNAME_LENGTH) {
      this.errorMessage = `Username must be ${MAX_USERNAME_LENGTH} characters or less`;
      return;
    }

    if (this.mode === 'create') {
      this.createRoom(trimmedUsername);
    } else if (this.mode === 'join') {
      this.joinRoom(trimmedUsername);
    }
  }

  createRoom(username: string): void {
    const roomName = this.roomName.trim() || 'My Retrospective Session';
    const userId = this.userService.getUserId();
    
    this.boardService.createBoard(roomName, userId).subscribe({
      next: (board) => {
        this.userService.setUsername(username);
        this.userService.setIsAdmin(true);
        // Navigate to board with room info
        this.router.navigate(['/board'], { 
          state: { boardId: board.id, roomCode: board.roomCode, isCreator: true } 
        });
      },
      error: (error) => {
        this.errorMessage = 'Failed to create room. Please try again.';
        console.error('Error creating room:', error);
      }
    });
  }

  joinRoom(username: string): void {
    const code = this.roomCode.trim().toUpperCase();
    
    if (!code || code.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-character room code';
      return;
    }

    this.boardService.getBoardByRoomCode(code).subscribe({
      next: (board) => {
        this.userService.setUsername(username);
        this.userService.setIsAdmin(false);
        // Navigate to board
        this.router.navigate(['/board'], { 
          state: { boardId: board.id, roomCode: board.roomCode, isCreator: false } 
        });
      },
      error: (error) => {
        if (error.status === 404) {
          this.errorMessage = 'Room not found. Please check the code and try again.';
        } else {
          this.errorMessage = 'Failed to join room. Please try again.';
        }
        console.error('Error joining room:', error);
      }
    });
  }
}
