import { Routes } from '@angular/router';

/**
 * Phase 1 is a single scrolling page; the six journey steps are #anchors, not
 * routes. Extra standalone pages (legal notice, privacy, cookie policy) are
 * lazy-loaded so they never weigh on the main bundle.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
    title: 'VIXERAN® | Autumn is Building Season',
  },
  {
    path: 'legal/:document',
    loadComponent: () => import('./pages/legal/legal').then((m) => m.LegalPage),
  },
  { path: '**', redirectTo: '' },
];
