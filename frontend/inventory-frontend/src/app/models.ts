export interface Location {
  id: number;
  name: string;
}

export interface Inventory {
  id: number;
  name: string;
  price: number;
  locationId: number;
  Location?: Location;
}

export interface PaginatedInventories {
  items: Inventory[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StatsRow {
  cinema: string;
  totalCount: number;
  totalPrice: number;
}
