import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inventory } from '../models';
import { Observable } from 'rxjs';
import { Location } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}
  private readonly apiUrl = 'http://localhost:4000';

  addLocation(payload: { name: string }) {
    return this.http.post<Inventory>(`${this.apiUrl}/locations`, payload);
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations`);
  }
}
