import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./home/home.component').then((m) => m.HomeComponent);
    },
  },
  {
    path: 'article',
    loadComponent: () => {
        return import('./article/article.component').then((m) => m.ArticleComponent);
    },
  },
  {
    path: 'list',
    loadComponent: () => {
        return import('./list/list.component').then((m) => m.ListComponent);
    },
  },
  {
    path: 'life',
    loadComponent: () => {
      return import('./game-of-life/game-of-life.component').then((m) => m.GameOfLifeComponent);
    }
  }
];
