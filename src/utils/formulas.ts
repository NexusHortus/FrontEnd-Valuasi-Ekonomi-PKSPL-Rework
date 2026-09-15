import { SpreadsheetRow } from '../types/spreadsheet';

/**
 * Menghitung otomatis Total Nilai Ekonomi pada satu baris spreadsheet.
 * Rumus utama:
 * 1. Jika Produktivitas & Luas Ha & Harga Unit terisi:
 *    Volume = Produktivitas * Luas Ha
 *    Total = Volume * Harga Unit
 * 2. Jika Jumlah & Harga Unit terisi:
 *    Total = Jumlah * Harga Unit
 */
export const calculateRowTotal = (row: Partial<SpreadsheetRow>): number => {
  const prod = Number(row.produktivitas) || 0;
  const luas = Number(row.luasHa) || 0;
  const harga = Number(row.hargaUnit) || 0;
  const jml = Number(row.jumlah) || 0;

  if (prod > 0 && luas > 0 && harga > 0) {
    return Math.round(prod * luas * harga);
  }

  if (jml > 0 && harga > 0) {
    return Math.round(jml * harga);
  }

  return 0;
};

/**
 * Menghitung kuantitas / volume baris (Jumlah)
 */
export const calculateRowQuantity = (row: Partial<SpreadsheetRow>): number => {
  const prod = Number(row.produktivitas) || 0;
  const luas = Number(row.luasHa) || 0;
  if (prod > 0 && luas > 0) {
    return Number((prod * luas).toFixed(2));
  }
  return Number(row.jumlah) || 0;
};
