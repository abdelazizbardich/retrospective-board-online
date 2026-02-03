import { Routes } from '@angular/router';
import { LobbyComponent } from './components/lobby/lobby.component';
import { BoardComponent } from './components/board/board.component';

export const routes: Routes = [
  { path: '', component: LobbyComponent },
  { path: 'board', component: BoardComponent },
  { path: '**', redirectTo: '' }
];
