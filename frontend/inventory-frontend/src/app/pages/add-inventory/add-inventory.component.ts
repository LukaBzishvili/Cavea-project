import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { Location } from '../../models';
import { LocationService } from '../../services/location.service';

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
  isLocation = false;

  form = this.fb.group({
    locationId: [null, Validators.required],
    name: ['', [Validators.required]],
    price: [null, [Validators.required, Validators.min(0.01)]],
  });

  constructor(
    private inventoryService: InventoryService,
    // private router: Router,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.locationService.getLocations().subscribe({
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
    if (this.isLocation) {
      this.locationService
        .addLocation({
          name: value.name!,
        })
        .subscribe({
          next: () => {
            this.outputShow();
          },
          error: () => (this.error = 'Failed to add location'),
        });
    } else {
      this.inventoryService
        .addInventory({
          name: value.name!,
          price: Number(value.price),
          locationId: Number(value.locationId),
        })
        .subscribe({
          next: () => {
            this.outputShow();
          },
          error: () => (this.error = 'Failed to add item'),
        });
    }
  }

  private setItemValidators(): void {
    this.f.locationId.setValidators([Validators.required]);
    this.f.price.setValidators([Validators.required, Validators.min(0.01)]);
    this.f.name.setValidators([Validators.required]);

    this.updateValidators();
  }

  private setLocationValidators(): void {
    this.f.locationId.clearValidators();
    this.f.price.clearValidators();
    this.f.name.setValidators([Validators.required]);

    this.updateValidators();
  }

  private updateValidators(): void {
    Object.values(this.form.controls).forEach((control) => {
      control.updateValueAndValidity();
    });
  }

  addItemOrLocation() {
    this.isLocation = !this.isLocation;
    this.submitted = false;
    this.error = null;
    this.showSuccess = false;

    if (this.isLocation) {
      this.setLocationValidators();
    } else {
      this.setItemValidators();
    }

    this.form.reset();
  }

  outputShow() {
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
  }
}
