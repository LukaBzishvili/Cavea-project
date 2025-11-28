import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Inventory, Location } from '../../models';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent implements OnInit {
  items: Inventory[] = [];
  locations: Location[] = [];
  selectedLocationId: number | null = null;
  total = 0;
  page = 1;
  pageSize = 20;

  sortBy: 'name' | 'price' | 'location' = 'name';
  sortDir: 'asc' | 'desc' = 'asc';

  loading = false;
  error: string | null = null;

  constructor(
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchLocations();
    this.fetchInventories();
  }

  fetchLocations() {
    this.inventoryService.getLocations().subscribe({
      next: (locations) => (this.locations = locations),
      error: () => (this.error = 'Failed to load locations'),
    });
  }

  fetchInventories() {
    this.loading = true;
    this.error = null;

    this.inventoryService
      .getInventories({
        page: this.page,
        limit: this.pageSize,
        locationId: this.selectedLocationId || undefined,
        sortBy: this.sortBy,
        sortDir: this.sortDir,
      })
      .subscribe({
        next: (res) => {
          this.items = res.items;
          this.total = res.total;
          this.page = res.page;
          this.pageSize = res.pageSize;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load inventories';
          this.loading = false;
        },
      });
  }

  onLocationChange() {
    this.page = 1;
    this.fetchInventories();
  }

  totalPages(): number {
    return Math.ceil(this.total / this.pageSize) || 1;
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchInventories();
    }
  }

  nextPage() {
    if (this.page < this.totalPages()) {
      this.page++;
      this.fetchInventories();
    }
  }

  changeSort(field: 'name' | 'price' | 'location') {
    if (this.sortBy === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDir = 'asc';
    }
    this.fetchInventories();
  }

  deleteItem(item: Inventory) {
    if (!confirm(`Delete "${item.name}"?`)) return;

    this.inventoryService.deleteInventory(item.id).subscribe({
      next: () => this.fetchInventories(),
      error: () => (this.error = 'Failed to delete item'),
    });
  }

  goToAdd() {
    this.router.navigate(['/add']);
  }

  goToStats() {
    this.router.navigate(['/stats']);
  }
}
