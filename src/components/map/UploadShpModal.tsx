import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { UploadCloud, CheckCircle2, FileArchive, X, AlertCircle, Info, Sparkles } from 'lucide-react';

interface UploadShpModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProjectId?: string;
  targetProjectName?: string;
}

export const UploadShpModal: React.FC<UploadShpModalProps> = ({
  isOpen,
  onClose,
  targetProjectId,
  targetProjectName,
}) => {
  const { activeProject, addShpLayer } = useProject();
  const [selectedFile, setSelectedFile] = useState<File | { name: string; size: number } | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const processFile = (file: { name: string; size: number }) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setErrorMsg('Tipe file tidak didukung. Silakan upload ZIP Shapefile.');
      setSelectedFile(null);
      setIsValidated(false);
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);
    setIsValidating(true);
    setIsValidated(false);

    // Simulate SHP validation check (CRS, geometry, .shp/.shx/.dbf/.prj completeness)
    setTimeout(() => {
      setIsValidating(false);
      setIsValidated(true);
    }, 600);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSimulateSampleZip = () => {
    processFile({
      name: 'Batas_Wilayah_Mangrove_Teluk_Benoa_WGS84.zip',
      size: 2450120
    });
  };

  const handleUploadSubmit = () => {
    if (!isValidated) return;
    const destProjId = targetProjectId || activeProject?.id;
    addShpLayer('Batas Wilayah & Tutupan Lahan SHP', 5, 'EPSG:4326 (WGS 84)', destProjId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-sm animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Upload Data SHP</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unggah berkas Shapefile terkompresi (.zip) untuk batas wilayah proyek
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* 1. Proyek Otomatis Terpilih */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Proyek Aktif
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shrink-0">
                {targetProjectId || activeProject?.code || 'PKS-994KY1'}
              </span>
              <span className="font-bold text-slate-800 text-xs truncate">
                {targetProjectName || activeProject?.name || 'Revitalisasi Mangrove Teluk Benoa'}
              </span>
            </div>
          </div>

          {/* 2. Drag & drop area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center transition-colors bg-slate-50/40"
          >
            <input
              type="file"
              accept=".zip"
              id="shp-upload-file-input"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="shp-upload-file-input" className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 border border-blue-100">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="font-semibold text-slate-800 text-xs">
                Pilih atau seret berkas ZIP Shapefile ke sini
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Format yang didukung: <strong>ZIP Shapefile (.zip)</strong> • Sistem Proyeksi <strong>WGS 1984</strong>
              </div>
              <div className="mt-3 px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs">
                Pilih Berkas ZIP
              </div>
            </label>

            {/* Quick Demo Helper */}
            <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-center">
              <button
                type="button"
                onClick={handleSimulateSampleZip}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
              >
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>Uji Coba Cepat: Gunakan Sampel SHP Mangrove (ZIP)</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Validation in progress */}
          {isValidating && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 flex items-center gap-2.5">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
              <span>Menganalisis arsip ZIP, struktur komponen (.shp, .shx, .dbf, .prj), dan sistem koordinat CRS...</span>
            </div>
          )}

          {/* Validated success preview */}
          {isValidated && selectedFile && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between font-semibold text-slate-800 pb-2 border-b border-slate-200">
                <span className="flex items-center gap-1.5 truncate">
                  <FileArchive className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">{selectedFile.name}</span>
                </span>
                <span className="text-slate-500 font-mono text-[11px] shrink-0 ml-2">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Komponen SHP & DBF valid</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>CRS: WGS 1984 (EPSG:4326)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>5 Poligon terdeteksi</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Geometri poligon siap pakai</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Informasi Catatan Penting */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              SHP akan digunakan sebagai batas wilayah dan dasar pembuatan Area Tutupan Lahan.
            </p>
          </div>
        </div>

        {/* Footer Buttons: [Batal] [Upload SHP] */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 rounded-md text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleUploadSubmit}
            disabled={!isValidated}
            className={`px-4 py-2 rounded-md text-xs font-semibold text-white transition-colors flex items-center gap-1.5 ${
              isValidated
                ? 'bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <span>Upload SHP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
