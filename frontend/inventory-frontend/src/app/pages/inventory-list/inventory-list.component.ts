import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Inventory, Location } from '../../models';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchLocations();

    this.route.queryParamMap.subscribe((params) => {
      const pageParam = params.get('page');
      const locationParam = params.get('locationId');
      const sortByParam = params.get('sortBy');
      const sortDirParam = params.get('sortDir');

      this.page = pageParam ? Number(pageParam) || 1 : 1;

      this.selectedLocationId = locationParam ? Number(locationParam) : null;

      if (
        sortByParam === 'price' ||
        sortByParam === 'location' ||
        sortByParam === 'name'
      ) {
        this.sortBy = sortByParam;
      } else {
        this.sortBy = 'name';
      }

      this.sortDir = sortDirParam === 'desc' ? 'desc' : 'asc';
      this.fetchInventories();
    });
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

  private updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page !== 1 ? this.page : null,
        locationId: this.selectedLocationId ?? null,
        sortBy: this.sortBy !== 'name' ? this.sortBy : null,
        sortDir: this.sortDir !== 'asc' ? this.sortDir : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  onLocationChange() {
    this.page = 1;
    this.updateQueryParams();
  }

  totalPages(): number {
    return Math.ceil(this.total / this.pageSize) || 1;
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updateQueryParams();
    }
  }

  nextPage() {
    if (this.page < this.totalPages()) {
      this.page++;
      this.updateQueryParams();
    }
  }

  changeSort(field: 'name' | 'price' | 'location') {
    if (this.sortBy === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDir = 'asc';
    }
    this.updateQueryParams();
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
