import React from 'react';
import { useProject } from '../context/ProjectContext';
import { useSpreadsheet } from '../context/SpreadsheetContext';
import { getMethodSchema } from '../types/methodSchemas';
import { formatIDR, formatNumber, formatDate } from '../utils/formatter';
import { ArrowLeft, Printer, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReportPrintView: React.FC = () => {
  const { activeProject, landCovers, indices, activeProjectId, getAreaConfig } = useProject();
  const { getServiceSubtotal, getGrandTotalForArea } = useSpreadsheet();
  const navigate = useNavigate();

  const refAreaId = landCovers[0]?.id || 'lc-01';
  const refConfig = getAreaConfig(refAreaId);

  const provSchema = getMethodSchema('provisioning', refConfig.selectedMethods.provisioning, 'flora');
  const regSchema = getMethodSchema('regulating', refConfig.selectedMethods.regulating);
  const suppSchema = getMethodSchema('supporting', refConfig.selectedMethods.supporting);
  const cultSchema = getMethodSchema('cultural', refConfig.selectedMethods.cultural);

  const provTotal = landCovers.reduce((s, lc) => {
    const c = getAreaConfig(lc.id);
    return s + (c.activeServices.provisioning ? getServiceSubtotal(activeProjectId, lc.id, 'provisioning', c.selectedMethods.provisioning, 'flora') : 0);
  }, 0);
  const regTotal = landCovers.reduce((s, lc) => {
    const c = getAreaConfig(lc.id);
    return s + (c.activeServices.regulating ? getServiceSubtotal(activeProjectId, lc.id, 'regulating', c.selectedMethods.regulating) : 0);
  }, 0);
  const suppTotal = landCovers.reduce((s, lc) => {
    const c = getAreaConfig(lc.id);
    return s + (c.activeServices.supporting ? getServiceSubtotal(activeProjectId, lc.id, 'supporting', c.selectedMethods.supporting) : 0);
  }, 0);
  const cultTotal = landCovers.reduce((s, lc) => {
    const c = getAreaConfig(lc.id);
    return s + (c.activeServices.cultural ? getServiceSubtotal(activeProjectId, lc.id, 'cultural', c.selectedMethods.cultural) : 0);
  }, 0);
  const grandTEV = provTotal + regTotal + suppTotal + cultTotal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-900">
      {/* Action Bar (hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={() => navigate(`/projects/${activeProjectId}/review`)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Review</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* Formal Document Sheet */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg border border-slate-200 shadow-lg p-8 md:p-12 space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Document Header (Kop Surat) */}
        <div className="border-b-2 border-slate-800 pb-4 text-center space-y-1">
          <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
            PUSAT KAJIAN SUMBERDAYA PESISIR DAN LAUTAN (PKSPL) — IPB UNIVERSITY
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
            Laporan Hasil Valuasi Ekonomi Sumberdaya Pesisir & Laut
          </h1>
          <p className="text-xs text-slate-600">
            Sistem Informasi Valuasi Sumberdaya Alam dan Lingkungan Berbasis Spasial
          </p>
        </div>

        {/* Project Metadata Table */}
        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded border border-slate-200">
          <div className="space-y-1.5">
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold">Kode Proyek:</span>
              <div className="font-mono font-bold text-blue-800">{activeProject?.code}</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold">Nama Penelitian:</span>
              <div className="font-semibold text-slate-900">{activeProject?.name}</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold">Lokasi Kawasan:</span>
              <div className="text-slate-800">{activeProject?.location}</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold">Peneliti Utama:</span>
              <div className="font-semibold text-slate-900">{activeProject?.lead}</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold">Tipe Ekosistem:</span>
              <div className="text-slate-800">{activeProject?.ecosystem}</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold">Tanggal Cetak:</span>
              <div className="text-slate-800">{formatDate(new Date().toISOString())}</div>
            </div>
          </div>
        </div>

        {/* Summary TEV Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            I. Rekapitulasi Total Economic Value (TEV) Berdasarkan Jasa Ekosistem
          </h3>

          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
              <tr>
                <th className="py-2 px-3 border-r border-slate-300 w-12 text-center">No</th>
                <th className="py-2 px-3 border-r border-slate-300">Kategori Jasa Ekosistem</th>
                <th className="py-2 px-3 border-r border-slate-300">Metodologi Ilmiah</th>
                <th className="py-2 px-3 text-right font-mono">Nilai Ekonomi (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2 px-3 text-center border-r border-slate-300 font-mono">1</td>
                <td className="py-2 px-3 border-r border-slate-300 font-semibold">Provisioning Services (Penyediaan)</td>
                <td className="py-2 px-3 border-r border-slate-300 text-slate-600">{provSchema.methodName}</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{formatIDR(provTotal)}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-center border-r border-slate-300 font-mono">2</td>
                <td className="py-2 px-3 border-r border-slate-300 font-semibold">Regulating Services (Pengaturan)</td>
                <td className="py-2 px-3 border-r border-slate-300 text-slate-600">{regSchema.methodName}</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{formatIDR(regTotal)}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-center border-r border-slate-300 font-mono">3</td>
                <td className="py-2 px-3 border-r border-slate-300 font-semibold">Supporting Services (Pendukung)</td>
                <td className="py-2 px-3 border-r border-slate-300 text-slate-600">{suppSchema.methodName}</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{formatIDR(suppTotal)}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-center border-r border-slate-300 font-mono">4</td>
                <td className="py-2 px-3 border-r border-slate-300 font-semibold">Cultural Services (Budaya/Wisata)</td>
                <td className="py-2 px-3 border-r border-slate-300 text-slate-600">{cultSchema.methodName}</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{formatIDR(cultTotal)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                <td colSpan={3} className="py-2.5 px-3 text-right uppercase border-r border-slate-300">
                  Total Economic Value (TEV):
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-sm text-blue-900 bg-blue-50/70">
                  {formatIDR(grandTEV)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Spatial Land Covers */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            II. Distribusi Spasial Area Tutupan Lahan
          </h3>

          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
              <tr>
                <th className="py-2 px-3 border-r border-slate-300">Area Tutupan</th>
                <th className="py-2 px-3 border-r border-slate-300 text-center w-24">Index Poligon</th>
                <th className="py-2 px-3 border-r border-slate-300 text-right w-24">Luas (Ha)</th>
                <th className="py-2 px-3 text-right font-mono">Total Nilai (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {landCovers.map((lc) => {
                const c = getAreaConfig(lc.id);
                const areaTotal = getGrandTotalForArea(activeProjectId, lc.id, c.activeServices, c.selectedMethods, 'flora');
                return (
                  <tr key={lc.id}>
                    <td className="py-2 px-3 border-r border-slate-300 font-medium">{lc.name}</td>
                    <td className="py-2 px-3 border-r border-slate-300 font-mono text-center text-blue-700">{lc.indexCode}</td>
                    <td className="py-2 px-3 border-r border-slate-300 text-right font-mono">{formatNumber(lc.areaHa)}</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">{formatIDR(areaTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section III: Master Index Kawasan */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            III. Master Index Kawasan & Integrasi Spasial
          </h3>

          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
              <tr>
                <th className="py-2 px-3 border-r border-slate-300 w-24">Kode Index</th>
                <th className="py-2 px-3 border-r border-slate-300">Nama Index Kawasan</th>
                <th className="py-2 px-3 border-r border-slate-300">Tutupan Lahan</th>
                <th className="py-2 px-3 border-r border-slate-300 text-right w-24">Luas (Ha)</th>
                <th className="py-2 px-3 text-center w-32">Status Integrasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {indices.map((idx) => (
                <tr key={idx.id}>
                  <td className="py-2 px-3 border-r border-slate-300 font-mono font-bold text-blue-800">{idx.code}</td>
                  <td className="py-2 px-3 border-r border-slate-300 font-medium">{idx.name}</td>
                  <td className="py-2 px-3 border-r border-slate-300 text-slate-600">{idx.landCoverName || idx.landCoverType || 'Mangrove'}</td>
                  <td className="py-2 px-3 border-r border-slate-300 text-right font-mono">{formatNumber(idx.areaHa || 50)} ha</td>
                  <td className="py-2 px-3 text-center text-[11px]">
                    {idx.spatialStatus === 'connected' ? '✓ Terhubung GIS' : '○ Non-Spasial'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section IV: Konfigurasi Jasa Ekosistem & Metodologi */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            IV. Metodologi Ilmiah & Konfigurasi Jasa Ekosistem
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="font-bold text-slate-800 block">Provisioning: Market Price & Effect on Production</span>
              <p className="text-[11px] text-slate-600 mt-0.5">Survei produksi tegakan kayu bakau, kepiting bakau, dan komoditas perikanan regional.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="font-bold text-slate-800 block">Regulating: Replacement Cost & Blue Carbon</span>
              <p className="text-[11px] text-slate-600 mt-0.5">Valuasi pelindung abrasi pantai dan potensi penyerapan stok karbon pesisir IPCC.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="font-bold text-slate-800 block">Supporting: Habitat Function & Nursery Ground</span>
              <p className="text-[11px] text-slate-600 mt-0.5">Penilaian fungsi biologis penopang populasi larva udang dan ikan karang.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="font-bold text-slate-800 block">Cultural: Travel Cost Method (TCM)</span>
              <p className="text-[11px] text-slate-600 mt-0.5">Pendekatan surplus konsumen pengunjung ekowisata mangrove dan rekreasi pesisir.</p>
            </div>
          </div>
        </div>

        {/* Signature Box */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-center">
          <div>
            <div className="text-slate-500 mb-16">Mengetahui, Peneliti Penanggung Jawab</div>
            <div className="font-bold text-slate-900 underline">{activeProject?.lead}</div>
            <div className="text-slate-500 text-[11px]">NIP. 19780412 200501 2 003</div>
          </div>

          <div>
            <div className="text-slate-500 mb-16">Diverifikasi oleh Validator / Analyst PKSPL</div>
            <div className="font-bold text-slate-900 underline">Ir. Hendra Gunawan, Ph.D.</div>
            <div className="text-slate-500 text-[11px]">Lead Economic Valuation Analyst</div>
          </div>
        </div>
      </div>
    </div>
  );
};
