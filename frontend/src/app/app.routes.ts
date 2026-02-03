import { Routes } from '@angular/router';
import { LobbyComponent } from './components/lobby/lobby.component';
import { BoardComponent } from './components/board/board.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LobbyComponent },
  { path: 'board', component: BoardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
