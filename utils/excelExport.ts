
import * as XLSX from 'xlsx';
import { Inventory, Product } from '../types';

export const exportInventoryToExcel = (inventory: Inventory, products: Product[]) => {
  // Converte a string YYYY-MM-DD para um objeto Date do JS
  // Usamos meio-dia (T12:00:00) para evitar problemas de fuso horário que poderiam mudar o dia
  const invDate = new Date(inventory.date + 'T12:00:00');

  const data = inventory.entries.map(entry => {
    const product = products.find(p => p.code === entry.productCode);
    return {
      'Loja': inventory.store,
      'Código do Material': entry.productCode,
      'Produto': product?.name || 'Não encontrado',
      'Unidade Padrão': product?.unit || '-',
      'Caixas': entry.boxes,
      'Pacotes': entry.packs,
      'Unidades Avulsas': entry.units,
      'Total Consolidado': entry.totalConsolidated,
      'Data do Inventário': invDate,
      'Responsável': inventory.responsible
    };
  });

  // cellDates: true garante que objetos Date sejam tratados como datas no Excel
  const worksheet = XLSX.utils.json_to_sheet(data, { cellDates: true });

  // A coluna 'Data do Inventário' agora é a 9ª (índice 8, coluna I)
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    const cellAddress = XLSX.utils.encode_cell({ r: R, c: 8 }); // Coluna I
    if (worksheet[cellAddress]) {
      // Força o formato de data brasileiro e garante que o tipo seja 'd' (date)
      worksheet[cellAddress].z = 'dd/mm/yyyy';
    }
  }

  // Configura larguras das colunas
  const wscols = [
    { wch: 20 }, // Loja
    { wch: 20 }, // Código
    { wch: 30 }, // Produto
    { wch: 15 }, // Unidade
    { wch: 10 }, // Caixas
    { wch: 10 }, // Pacotes
    { wch: 15 }, // Unidades
    { wch: 15 }, // Total
    { wch: 15 }, // Data
    { wch: 25 }, // Responsável
  ];
  worksheet['!cols'] = wscols;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventário');

  const fileName = `Inventario_${inventory.store.replace(/\s+/g, '_')}_${inventory.date.replace(/-/g, '')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
