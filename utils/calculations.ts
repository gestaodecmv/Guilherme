
import { Product } from '../types';

export const calculateConsolidated = (
  product: Product,
  boxes: number,
  packs: number,
  units: number
): number => {
  const total = 
    (boxes * product.factorBox) + 
    (packs * product.factorPack) + 
    (units * product.factorUnit);
  
  // Return fixed to 3 decimal places to avoid floating point issues
  return parseFloat(total.toFixed(3));
};

export const formatDecimal = (val: number): string => {
  return val.toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};
