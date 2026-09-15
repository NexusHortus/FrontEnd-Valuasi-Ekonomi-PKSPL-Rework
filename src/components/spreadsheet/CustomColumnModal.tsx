import React, { useState, useEffect } from 'react';
import { CustomColumnDefinition, CustomColumnType } from '../../types/methodSchemas';
import { X, Columns3, AlertCircle } from 'lucide-react';

interface CustomColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { label: string; type: CustomColumnType; required: boolean }) => void;
  editingColumn?: CustomColumnDefinition | null;
  existingColumnLabels: string[];
}

export const CustomColumnModal: React.FC<CustomColumnModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingColumn,
  existingColumnLabels,
}) => {
  const [label, setLabel] = useState('');
  const [type, setType] = useState<CustomColumnType>('text');
  const [required, setRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingColumn) {
        setLabel(editingColumn.label);
        setType(editingColumn.type);
        setRequired(!!editingColumn.required);
      } else {
        setLabel('');
        setType('text');
        setRequired(false);
      }
      setError(null);
    }
  }, [isOpen, editingColumn]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = label.trim();

    if (!trimmed) {
      setError('Nama kolom tidak boleh kosong.');
      return;
    }

    // Check duplicate if adding or changing name
    const isEditingCurrent = editingColumn && editingColumn.label.toLowerCase() === trimmed.toLowerCase();
    if (!isEditingCurrent) {
      const isDuplicate = existingColumnLabels.some(
        l => l.toLowerCase() === trimmed.toLowerCase()
      );
      if (isDuplicate) {
        setError(`Kolom dengan nama "${trimmed}" sudah ada di tabel ini.`);
        return;
      }
    }

    onSave({
      label: trimmed,
      type,
      required,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden text-sm animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Columns3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                {editingColumn ? 'Edit Kolom' : 'Tambah Kolom'}
              </h3>
              <div className="text-[11px] text-slate-500">
                Variabel tambahan untuk lembar kerja penelitian
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Nama Kolom */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Nama Kolom <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: Lokasi Sampel, Tanggal Survei, Catatan..."
              autoFocus
              className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded text-xs text-slate-800 transition-colors"
            />
            <p className="text-[11px] text-slate-400">
              Gunakan nama yang jelas mendeskripsikan observasi atau data survei.
            </p>
          </div>

          {/* Tipe Data */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Tipe Data
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CustomColumnType)}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded text-xs text-slate-800 font-medium transition-colors cursor-pointer"
            >
              <option value="text">Teks (String umum / catatan / kode)</option>
              <option value="integer">Angka (Bilangan bulat)</option>
              <option value="decimal">Desimal (Bilangan pecahan / nilai ukur)</option>
              <option value="date">Tanggal (Format penanggalan YYYY-MM-DD)</option>
              <option value="boolean">Ya/Tidak (Pilihan biner)</option>
            </select>
          </div>

          {/* Checkbox Wajib Diisi */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div>
                <span className="text-xs font-medium text-slate-700 select-none">
                  Wajib diisi
                </span>
                <p className="text-[11px] text-slate-400 select-none">
                  Menandai bahwa variabel ini diharapkan terisi pada setiap baris observasi.
                </p>
              </div>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 rounded text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              {editingColumn ? 'Simpan Perubahan' : 'Tambah Kolom'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomColumnModal;
