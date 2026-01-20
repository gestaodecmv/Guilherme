
export enum UnitType {
  UN = 'UN',
  KG = 'KG',
  L = 'L'
}

export enum ProductStatus {
  Active = 'Ativo',
  Inactive = 'Inativo'
}

export interface Product {
  code: string;
  name: string;
  category?: string;
  unit: UnitType;
  factorBox: number;
  factorPack: number;
  factorUnit: number;
  status: ProductStatus;
}

export interface InventoryEntry {
  productCode: string;
  boxes: number;
  packs: number;
  units: number;
  totalConsolidated: number;
}

export interface Inventory {
  id: string;
  date: string; // YYYY-MM-DD
  responsible: string;
  store: string;
  entries: InventoryEntry[];
  createdAt: string;
  updatedAt?: string;
}

export type AppView = 'PRODUCTS' | 'INVENTORY' | 'HISTORY';
