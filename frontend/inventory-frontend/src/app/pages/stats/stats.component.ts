import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { StatsRow } from '../../models';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent implements OnInit {
  rows: StatsRow[] = [];
  loading = false;
  error: string | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loading = true;
    this.inventoryService.getStats().subscribe({
      next: (rows) => {
        this.rows = rows;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load statistics';
        this.loading = false;
      },
    });
  }
}
