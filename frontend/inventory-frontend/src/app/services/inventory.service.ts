import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inventory, PaginatedInventories, Location, StatsRow } from '../models';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  constructor(private http: HttpClient) {}
  private readonly apiUrl = 'http://localhost:4000';

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations`);
  }

  getInventories(options: {
    page?: number;
    limit?: number;
    locationId?: number | null;
    sortBy?: 'name' | 'price' | 'location';
    sortDir?: 'asc' | 'desc';
  }): Observable<PaginatedInventories> {
    let params = new HttpParams();
    params = params.set('page', (options.page ?? 1).toString());
    params = params.set('limit', (options.limit ?? 20).toString());
    if (options.locationId) {
      params = params.set('locationId', options.locationId.toString());
    }
    if (options.sortBy) {
      params = params.set('sortBy', options.sortBy);
    }
    if (options.sortDir) {
      params = params.set('sortDir', options.sortDir);
    }

    return this.http.get<PaginatedInventories>(`${this.apiUrl}/inventories`, {
      params,
    });
  }

  addInventory(payload: { name: string; price: number; locationId: number }) {
    return this.http.post<Inventory>(`${this.apiUrl}/inventories`, payload);
  }

  deleteInventory(id: number | string) {
    return this.http.delete(`${this.apiUrl}/inventories/${id}`);
  }

  getStats(): Observable<StatsRow[]> {
    return this.http.get<StatsRow[]>(`${this.apiUrl}/inventories/stats`);
  }
}
