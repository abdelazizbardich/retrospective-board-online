import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

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
  isAdmin: boolean = false;
  errorMessage: string = '';
  readonly maxUsernameLength = MAX_USERNAME_LENGTH;

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

    if (trimmedUsername.length < MIN_USERNAME_LENGTH) {
      this.errorMessage = `Username must be at least ${MIN_USERNAME_LENGTH} characters`;
      return;
    }

    if (trimmedUsername.length > MAX_USERNAME_LENGTH) {
      this.errorMessage = `Username must be ${MAX_USERNAME_LENGTH} characters or less`;
      return;
    }

    // Save username and admin status, then navigate to board
    this.userService.setUsername(trimmedUsername);
    this.userService.setIsAdmin(this.isAdmin);
    this.router.navigate(['/board']);
  }
}
