import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usernameSubject = new BehaviorSubject<string>('');
  private userIdSubject = new BehaviorSubject<string>('');

  constructor() {
    // Generate a unique user ID using crypto.randomUUID for better uniqueness
    const userId = crypto.randomUUID();
    this.userIdSubject.next(userId);
  }

  setUsername(username: string): void {
    this.usernameSubject.next(username);
  }

  getUsername(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  getUsernameValue(): string {
    return this.usernameSubject.value;
  }

  getUserId(): string {
    return this.userIdSubject.value;
  }
}
