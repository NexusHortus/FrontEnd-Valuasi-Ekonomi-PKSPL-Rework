import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { CustomColumnDefinition } from '../../types/methodSchemas';

interface DeleteColumnConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  column: CustomColumnDefinition | null;
}

export const DeleteColumnConfirmModal: React.FC<DeleteColumnConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  column,
}) => {
  if (!isOpen || !column) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden text-sm animate-in zoom-in-95 duration-150">
        <div className="p-5 text-center space-y-3">
          <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Hapus Kolom ini?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Kolom <strong className="text-slate-800 font-semibold">"{column.label}"</strong> dan seluruh data nilai cell pada kolom ini di setiap baris akan ikut dihapus permanen.
            </p>
          </div>
        </div>

        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 rounded text-xs font-medium text-slate-700 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            Hapus Kolom
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteColumnConfirmModal;
