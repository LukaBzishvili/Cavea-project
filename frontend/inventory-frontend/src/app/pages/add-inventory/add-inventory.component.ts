import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { Location } from '../../models';

@Component({
  selector: 'app-add-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.scss'],
})
export class AddInventoryComponent implements OnInit {
  private fb = inject(FormBuilder);

  locations: Location[] = [];
  submitted = false;
  error: string | null = null;
  isSubmitting = false;
  showSuccess = false;

  form = this.fb.group({
    locationId: [null, Validators.required],
    name: ['', [Validators.required]],
    price: [null, [Validators.required, Validators.min(0.01)]],
  });

  constructor(
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inventoryService.getLocations().subscribe({
      next: (locations) => (this.locations = locations),
      error: () => (this.error = 'Failed to load locations'),
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = null;

    if (this.form.invalid) return;

    const value = this.form.value;
    this.inventoryService
      .addInventory({
        name: value.name!,
        price: Number(value.price),
        locationId: Number(value.locationId),
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showSuccess = true;

          setTimeout(() => {
            this.showSuccess = false;
            this.form.reset({
              locationId: null,
              name: '',
              price: null,
            });
            this.submitted = false;
          }, 1000);
        },
        error: () => (this.error = 'Failed to add item'),
      });
  }
}
