export interface SpreadsheetRow {
  id: string;
  no: number;
  item: string; // e.g. Jenis Flora/Fauna, Jenis Aset, Komoditas
  produktivitas: number | null; // e.g. m3/ha, kg/ha, ton/ha
  satuan: string; // e.g. m3/ha, kg/tahun, ton
  hargaUnit: number | null; // IDR
  jumlah: number | null; // optional volume/kuantitas
  luasHa: number;
  totalNilai: number; // READ-ONLY calculated: (produktivitas * luasHa * hargaUnit) or (jumlah * hargaUnit)
  note?: string;
  source?: string;
  status: 'draft' | 'valid' | 'invalid';
  validationError?: string;
}

export interface SpreadsheetContextState {
  areaId: string;
  serviceId: string;
  methodId: string;
  biota?: string;
  rows: SpreadsheetRow[];
  lastSaved: string | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

export interface TemplateValidationRule {
  expectedService: string;
  expectedMethod: string;
  expectedCategory?: string;
  templateFileName: string;
  requiredColumns: string[];
}
