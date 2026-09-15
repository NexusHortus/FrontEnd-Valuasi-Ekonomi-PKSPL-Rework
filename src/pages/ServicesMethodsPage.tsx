import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { ECOSYSTEM_SERVICES_CONFIG } from '../mock/valuationMock';
import { EcosystemServiceId } from '../types/valuation';
import { getMethodSchema } from '../types/methodSchemas';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Layers,
  SearchCode,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Info,
  ChevronDown,
  Check,
  Tag,
  SlidersHorizontal,
  TableProperties
} from 'lucide-react';

export const ServicesMethodsPage: React.FC = () => {
  const {
    activeProject,
    landCovers,
    indices,
    activeProjectId,
    getAreaConfig,
    updateAreaConfig
  } = useProject();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Selected area tutupan lahan: from query param or first item
  const queryArea = searchParams.get('area');
  const [selectedAreaId, setSelectedAreaId] = useState<string>(() => {
    if (queryArea) return queryArea;
    if (landCovers.length > 0) return landCovers[0].id;
    return 'poly-1';
  });

  const currentArea = landCovers.find(lc => lc.id === selectedAreaId) || landCovers[0];
  const areaConfig = getAreaConfig(selectedAreaId);

  // Method options per service category (configuration-driven)
  const METHOD_OPTIONS: Record<EcosystemServiceId, { id: string; name: string; subtitle: string; desc: string; variables: string[] }[]> = {
    provisioning: [
      {
        id: 'market-price',
        name: 'Market Price (Nilai Pasar Aktual)',
        subtitle: 'Berdasarkan harga transaksi riil di pasar',
        desc: 'Menilai komoditas panen tegakan atau hasil tangkapan perikanan berdasarkan volume produktivitas dan harga pasar setempat.',
        variables: ['Produktivitas (satuan/ha)', 'Luas Area (ha)', 'Harga Pasar per Satuan (Rp)']
      },
      {
        id: 'effect-production',
        name: 'Effect on Production (Dampak terhadap Produksi)',
        subtitle: 'Fungsi ekosistem sebagai input perantara',
        desc: 'Mengukur kontribusi jasa ekologis sebagai input lingkungan bagi output sektor budidaya atau perikanan di sekitarnya.',
        variables: ['Kuantitas Output Terpengaruh', 'Harga Output Pasar', 'Biaya Input Tambahan']
      }
    ],
    regulating: [
      {
        id: 'replacement-cost',
        name: 'Replacement Cost (Biaya Penggantian)',
        subtitle: 'Setara biaya konstruksi pelindung pantai fisik',
        desc: 'Menilai fungsi peredam gelombang dan penahan abrasi pantai setara dengan biaya pembuatan seawall beton buatan.',
        variables: ['Panjang Garis Pantai / Unit (m)', 'Biaya Konstruksi Tanggul Pengganti (Rp/m)']
      },
      {
        id: 'carbon-storage',
        name: 'Climate / Carbon Storage (Stok Karbon Biru)',
        subtitle: 'Kapasitas serapan dan cadangan biomassa karbon',
        desc: 'Menilai kandungan karbon tersimpan pada biomassa mangrove dan padang lamun dikalikan nilai pasar shadow karbon.',
        variables: ['Stok Karbon Biomassa (ton C/ha)', 'Luas Area (ha)', 'Harga Karbon IDXCarbon (Rp/ton CO2e)']
      },
      {
        id: 'avoided-cost',
        name: 'Avoided Cost (Biaya Kerusakan Terhindar)',
        subtitle: 'Potensi kerugian ekonomi yang dicegah',
        desc: 'Mengestimasi nilai risiko kerusakan permukiman warga dan tambak yang terhindar dari gelombang pasang atau intrusi air laut.',
        variables: ['Probabilitas Bencana / Tahun', 'Estimasi Nilai Risiko Kerusakan Terhindar (Rp)']
      },
      {
        id: 'hpm',
        name: 'Hedonic Pricing Method (HPM)',
        subtitle: 'Premi kualitas lingkungan pada nilai aset',
        desc: 'Menilai kontribusi kualitas ekosistem pesisir terhadap peningkatan harga tanah atau properti di kawasan sekitar.',
        variables: ['Jumlah Unit Aset / Properti', 'Selisih Nilai Premi Kualitas Lingkungan (Rp)']
      }
    ],
    supporting: [
      {
        id: 'nursery-ground',
        name: 'Habitat & Nursery Ground (Asuhan Biota)',
        subtitle: 'Tempat pembesaran larva dan benih biota bernilai ekonomi',
        desc: 'Menilai fungsi perakaran ekosistem sebagai habitat asuhan larva udang, kepiting bakau, dan ikan karang.',
        variables: ['Luas Habitat Penopang (ha)', 'Nilai Kontribusi Rekrutmen Benih / Ha / Thn (Rp)']
      },
      {
        id: 'nutrient-cycling',
        name: 'Nutrient Cycling (Siklus Nutrisi & Hara)',
        subtitle: 'Penyaring sedimen dan pendaur ulang hara estuari',
        desc: 'Menilai kapasitas retensi hara dan pengendapan lumpur tersuspensi yang menjaga kejernihan perairan.',
        variables: ['Laju Sedimentasi Hara (ton/ha/thn)', 'Biaya Penggantian Nutrisi Tanah / Pupuk Alami']
      }
    ],
    cultural: [
      {
        id: 'tcm',
        name: 'Travel Cost Method (TCM)',
        subtitle: 'Metode Biaya Perjalanan Pengunjung',
        desc: 'Mengestimasi surplus konsumen dan nilai manfaat rekreasi ekowisata pesisir berdasarkan pengeluaran riil wisatawan untuk berkunjung.',
        variables: ['Jumlah Kunjungan per Tahun', 'Rata-rata Biaya Perjalanan per Orang', 'Biaya Tiket / Retribusi']
      },
      {
        id: 'cvm',
        name: 'Contingent Valuation Method (CVM)',
        subtitle: 'Kesediaan Membayar (Willingness to Pay / WTP)',
        desc: 'Mengukur kesediaan membayar (WTP) masyarakat dan wisatawan untuk program konservasi melalui survei kuesioner hipotetis terstruktur.',
        variables: ['Jumlah Populasi Responden', 'Rata-rata Nilai WTP per Tahun (Rp)', 'Tingkat Validitas Data Kuesioner']
      },
      {
        id: 'choice-experiment',
        name: 'Choice Experiment (Eksperimen Pilihan)',
        subtitle: 'Preferensi atas berbagai atribut kualitas lingkungan',
        desc: 'Menilai nilai marginal yang diberikan publik terhadap kombinasi atribut ekosistem (kerapatan mangrove, keanekaragaman, fasilitas wisata).',
        variables: ['Jumlah Responden Pilihan', 'Nilai Marginal Atribut Terpilih (Rp)', 'Biaya Skema Implementasi (Rp)']
      }
    ]
  };

  const toggleService = (serviceId: EcosystemServiceId) => {
    const currentState = areaConfig.activeServices[serviceId];
    const nextState = !currentState;
    updateAreaConfig(selectedAreaId, {
      activeServices: {
        ...areaConfig.activeServices,
        [serviceId]: nextState,
      },
    });
  };

  const handleMethodChange = (serviceId: EcosystemServiceId, methodId: string) => {
    updateAreaConfig(selectedAreaId, {
      selectedMethods: {
        ...areaConfig.selectedMethods,
        [serviceId]: methodId,
      },
    });
  };

  const handleBiotaChange = (newBiota: 'flora' | 'fauna') => {
    updateAreaConfig(selectedAreaId, { biota: newBiota });
  };

  const handleAreaSelect = (areaId: string) => {
    setSelectedAreaId(areaId);
    setSearchParams({ area: areaId });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Tahap 05</span>
            <span>•</span>
            <span className="text-blue-600">Konfigurasi Valuasi</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <SlidersHorizontal className="w-6 h-6 text-blue-600" />
            <span>Jasa & Metode</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Tentukan jasa ekosistem dan metode valuasi untuk setiap Area Tutupan Lahan.
          </p>
        </div>

        <button
          onClick={() => navigate(`/projects/${activeProjectId}/valuation-data?area=${selectedAreaId}`)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs md:text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <TableProperties className="w-4 h-4" />
          <span>Buka Data Valuasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* STEP 1: Pilih Area Tutupan Lahan */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-slate-800 text-sm">
              Pilih Area Tutupan Lahan:
            </h3>
          </div>

          <div className="text-xs text-slate-500">
            Setiap area tutupan lahan dapat memiliki konfigurasi jasa & metode yang berbeda.
          </div>
        </div>

        {/* Area Selector dropdown + quick card pills */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
              Pilihan Area Target (Dropdown):
            </label>
            <div className="relative">
              <select
                value={selectedAreaId}
                onChange={(e) => handleAreaSelect(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none pr-8"
              >
                {landCovers.map((lc) => {
                  const idxCode = lc.indexCode || 'Belum ada Index';
                  return (
                    <option key={lc.id} value={lc.id}>
                      {lc.name} — {lc.areaHa} ha ({idxCode})
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Current Area Summary Badge */}
          {currentArea && (
            <div className="md:col-span-2 bg-blue-50/70 border border-blue-200 rounded p-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  Area Terpilih Saat Ini
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {currentArea.name}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {currentArea.areaHa} ha • <span className="capitalize">{currentArea.type.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-blue-700 font-bold bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
                  {currentArea.indexCode || 'NON-INDEX'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STEP 2: Pilih Jasa Ekosistem (2x2 Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-slate-800 text-sm">
              Tentukan Jasa Ekosistem & Metode Valuasi untuk {currentArea?.name}:
            </h3>
          </div>

          <div className="text-xs text-slate-400">
            Perubahan otomatis tersimpan
          </div>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* A. Provisioning Services */}
          {(() => {
            const isActive = areaConfig.activeServices.provisioning;
            const currentMethodId = areaConfig.selectedMethods.provisioning || 'market-price';
            const options = METHOD_OPTIONS.provisioning;
            const activeMethod = options.find(m => m.id === currentMethodId) || options[0];

            return (
              <div
                className={`rounded-lg border transition-all p-5 flex flex-col justify-between space-y-4 shadow-2xs ${
                  isActive
                    ? 'bg-white border-cyan-300 border-l-4 border-l-cyan-600'
                    : 'bg-slate-50/70 border-slate-200 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                          A. PROVISIONING
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">Jasa Penyediaan</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Komoditas material riil yang dipanen dari ekosistem.
                      </p>
                    </div>

                    <button
                      onClick={() => toggleService('provisioning')}
                      className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isActive
                          ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {isActive ? <Check className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      <span>{isActive ? '✓ Aktif' : 'Aktifkan'}</span>
                    </button>
                  </div>

                  {isActive && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      {/* Biota Switcher */}
                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="font-semibold text-slate-700">Kategori Biota:</span>
                        <div className="inline-flex rounded-md shadow-2xs">
                          <button
                            onClick={() => handleBiotaChange('flora')}
                            className={`px-3 py-1 text-xs font-semibold rounded-l-md transition-colors ${
                              (areaConfig.biota || 'flora') === 'flora'
                                ? 'bg-cyan-600 text-white'
                                : 'bg-white text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            Flora (Vegetasi)
                          </button>
                          <button
                            onClick={() => handleBiotaChange('fauna')}
                            className={`px-3 py-1 text-xs font-semibold rounded-r-md transition-colors ${
                              areaConfig.biota === 'fauna'
                                ? 'bg-cyan-600 text-white'
                                : 'bg-white text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            Fauna (Perikanan)
                          </button>
                        </div>
                      </div>

                      {/* Method selector */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                          Metode Valuasi Ilmiah:
                        </label>
                        <select
                          value={currentMethodId}
                          onChange={(e) => handleMethodChange('provisioning', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        >
                          {options.map(opt => (
                            <option key={opt.id} value={opt.id}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Method Description & Variables */}
                      <div className="p-3 bg-cyan-50/50 rounded border border-cyan-100 text-xs space-y-1.5">
                        <div className="font-semibold text-cyan-900">{activeMethod.name}</div>
                        <div className="text-[11px] text-slate-600 leading-relaxed">{activeMethod.desc}</div>
                        <div className="pt-1 text-[11px] text-cyan-800">
                          <strong>Variabel Input:</strong> {activeMethod.variables.join(', ')}
                        </div>
                      </div>
                    </div>
                  )}

                  {!isActive && (
                    <div className="text-xs text-slate-400 italic py-2">
                      ○ Belum dipilih untuk area {currentArea?.name}. Klik tombol "Aktifkan" untuk menyertakan jasa penyediaan.
                    </div>
                  )}
                </div>

                {isActive && (
                  <button
                    onClick={() => navigate(`/projects/${activeProjectId}/valuation-data?area=${selectedAreaId}&service=provisioning`)}
                    className="w-full py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-semibold rounded text-xs border border-cyan-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Buka Data Valuasi ({activeMethod.name.split('(')[0].trim()})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })()}

          {/* B. Regulating Services */}
          {(() => {
            const isActive = areaConfig.activeServices.regulating;
            const currentMethodId = areaConfig.selectedMethods.regulating || 'replacement-cost';
            const options = METHOD_OPTIONS.regulating;
            const activeMethod = options.find(m => m.id === currentMethodId) || options[0];

            return (
              <div
                className={`rounded-lg border transition-all p-5 flex flex-col justify-between space-y-4 shadow-2xs ${
                  isActive
                    ? 'bg-white border-blue-300 border-l-4 border-l-blue-600'
                    : 'bg-slate-50/70 border-slate-200 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          B. REGULATING
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">Jasa Pengaturan</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Regulasi proses ekologis, penahan abrasi, dan penyerapan karbon.
                      </p>
                    </div>

                    <button
                      onClick={() => toggleService('regulating')}
                      className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isActive
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {isActive ? <Check className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      <span>{isActive ? '✓ Aktif' : 'Aktifkan'}</span>
                    </button>
                  </div>

                  {isActive && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                          Metode Valuasi Ilmiah:
                        </label>
                        <select
                          value={currentMethodId}
                          onChange={(e) => handleMethodChange('regulating', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {options.map(opt => (
                            <option key={opt.id} value={opt.id}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Method Description & Variables */}
                      <div className="p-3 bg-blue-50/50 rounded border border-blue-100 text-xs space-y-1.5">
                        <div className="font-semibold text-blue-900">{activeMethod.name}</div>
                        <div className="text-[11px] text-slate-600 leading-relaxed">{activeMethod.desc}</div>
                        <div className="pt-1 text-[11px] text-blue-800">
                          <strong>Variabel Input:</strong> {activeMethod.variables.join(', ')}
                        </div>
                      </div>
                    </div>
                  )}

                  {!isActive && (
                    <div className="text-xs text-slate-400 italic py-2">
                      ○ Belum dipilih untuk area {currentArea?.name}. Klik tombol "Aktifkan" untuk menyertakan jasa pengaturan.
                    </div>
                  )}
                </div>

                {isActive && (
                  <button
                    onClick={() => navigate(`/projects/${activeProjectId}/valuation-data?area=${selectedAreaId}&service=regulating`)}
                    className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold rounded text-xs border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Buka Data Valuasi ({activeMethod.name.split('(')[0].trim()})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })()}

          {/* C. Supporting Services */}
          {(() => {
            const isActive = areaConfig.activeServices.supporting;
            const currentMethodId = areaConfig.selectedMethods.supporting || 'nursery-ground';
            const options = METHOD_OPTIONS.supporting;
            const activeMethod = options.find(m => m.id === currentMethodId) || options[0];

            return (
              <div
                className={`rounded-lg border transition-all p-5 flex flex-col justify-between space-y-4 shadow-2xs ${
                  isActive
                    ? 'bg-white border-purple-300 border-l-4 border-l-purple-600'
                    : 'bg-slate-50/70 border-slate-200 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                          C. SUPPORTING
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">Jasa Pendukung & Habitat</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Fungsi nursery ground, feeding area, keanekaragaman hayati pesisir.
                      </p>
                    </div>

                    <button
                      onClick={() => toggleService('supporting')}
                      className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isActive
                          ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {isActive ? <Check className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      <span>{isActive ? '✓ Aktif' : 'Aktifkan'}</span>
                    </button>
                  </div>

                  {isActive && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                          Metode Valuasi Ilmiah:
                        </label>
                        <select
                          value={currentMethodId}
                          onChange={(e) => handleMethodChange('supporting', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          {options.map(opt => (
                            <option key={opt.id} value={opt.id}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Method Description & Variables */}
                      <div className="p-3 bg-purple-50/50 rounded border border-purple-100 text-xs space-y-1.5">
                        <div className="font-semibold text-purple-900">{activeMethod.name}</div>
                        <div className="text-[11px] text-slate-600 leading-relaxed">{activeMethod.desc}</div>
                        <div className="pt-1 text-[11px] text-purple-800">
                          <strong>Variabel Input:</strong> {activeMethod.variables.join(', ')}
                        </div>
                      </div>
                    </div>
                  )}

                  {!isActive && (
                    <div className="text-xs text-slate-400 italic py-2">
                      ○ Belum dipilih untuk area {currentArea?.name}. Klik tombol "Aktifkan" untuk menyertakan jasa pendukung.
                    </div>
                  )}
                </div>

                {isActive && (
                  <button
                    onClick={() => navigate(`/projects/${activeProjectId}/valuation-data?area=${selectedAreaId}&service=supporting`)}
                    className="w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold rounded text-xs border border-purple-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Buka Data Valuasi ({activeMethod.name.split('(')[0].trim()})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })()}

          {/* D. Cultural Services (Lengkap dengan TCM, CVM, Choice Experiment) */}
          {(() => {
            const isActive = areaConfig.activeServices.cultural;
            const currentMethodId = areaConfig.selectedMethods.cultural || 'tcm';
            const options = METHOD_OPTIONS.cultural;
            const activeMethod = options.find(m => m.id === currentMethodId) || options[0];

            return (
              <div
                className={`rounded-lg border transition-all p-5 flex flex-col justify-between space-y-4 shadow-2xs ${
                  isActive
                    ? 'bg-white border-amber-300 border-l-4 border-l-amber-600'
                    : 'bg-slate-50/70 border-slate-200 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          D. CULTURAL
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">Jasa Budaya & Rekreasi</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Ekowisata susur mangrove, edukasi penelitian, dan kesediaan membayar publik.
                      </p>
                    </div>

                    <button
                      onClick={() => toggleService('cultural')}
                      className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isActive
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {isActive ? <Check className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      <span>{isActive ? '✓ Aktif' : 'Aktifkan'}</span>
                    </button>
                  </div>

                  {isActive && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                          Metode Valuasi Ilmiah:
                        </label>
                        <select
                          value={currentMethodId}
                          onChange={(e) => handleMethodChange('cultural', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          {options.map(opt => (
                            <option key={opt.id} value={opt.id}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Method Description & Variables */}
                      <div className="p-3 bg-amber-50/50 rounded border border-amber-100 text-xs space-y-1.5">
                        <div className="font-semibold text-amber-900">{activeMethod.name}</div>
                        <div className="text-[11px] text-slate-600 leading-relaxed">{activeMethod.desc}</div>
                        <div className="pt-1 text-[11px] text-amber-800">
                          <strong>Variabel Input:</strong> {activeMethod.variables.join(', ')}
                        </div>
                      </div>
                    </div>
                  )}

                  {!isActive && (
                    <div className="text-xs text-slate-400 italic py-2">
                      ○ Belum dipilih untuk area {currentArea?.name}. Klik tombol "Aktifkan" untuk menyertakan jasa budaya (TCM, CVM, atau Choice Experiment).
                    </div>
                  )}
                </div>

                {isActive && (
                  <button
                    onClick={() => navigate(`/projects/${activeProjectId}/valuation-data?area=${selectedAreaId}&service=cultural`)}
                    className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded text-xs border border-amber-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Buka Data Valuasi ({activeMethod.name.split('(')[0].trim()})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Next Step Banner */}
      <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
            ✓
          </div>
          <div>
            <div className="font-bold text-slate-800 text-xs">Konfigurasi jasa & metode tersimpan.</div>
            <div className="text-slate-500 text-[11px]">
              Langkah berikutnya: Masukkan variabel data valuasi ke dalam spreadsheet sesuai metode yang telah ditentukan.
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/projects/${activeProjectId}/valuation-data?area=${selectedAreaId}`)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto flex-shrink-0 cursor-pointer"
        >
          <span>Lanjut ke 06 Data Valuasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
