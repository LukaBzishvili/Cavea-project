import { Routes } from '@angular/router';
import { InventoryListComponent } from './pages/inventory-list/inventory-list.component';
import { AddInventoryComponent } from './pages/add-inventory/add-inventory.component';
import { StatsComponent } from './pages/stats/stats.component';

export const routes: Routes = [
  { path: '', component: InventoryListComponent },
  {
    path: 'add',
    component: AddInventoryComponent,
  },
  {
    path: 'stats',
    component: StatsComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
