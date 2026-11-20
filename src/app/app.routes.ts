import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Viewer } from './viewer/viewer';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'viewer', component: Viewer },
];
