import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {
  username: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onJoinBoard(): void {
    const trimmedUsername = this.username.trim();
    
    if (!trimmedUsername) {
      this.errorMessage = 'Please enter a username';
      return;
    }

    if (trimmedUsername.length < 2) {
      this.errorMessage = 'Username must be at least 2 characters';
      return;
    }

    if (trimmedUsername.length > 20) {
      this.errorMessage = 'Username must be less than 20 characters';
      return;
    }

    // Save username and navigate to board
    this.userService.setUsername(trimmedUsername);
    this.router.navigate(['/board']);
  }
}
