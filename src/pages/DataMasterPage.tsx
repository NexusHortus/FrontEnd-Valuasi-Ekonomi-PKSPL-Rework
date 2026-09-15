import React, { useState, useMemo } from 'react';
import {
  Database,
  ChevronDown,
  Search,
  Eye,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Shield,
  Heart,
  Palette,
  X,
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  DAERAH_OPTIONS,
  EKOSISTEM_OPTIONS,
  PROVISIONING_DATA,
  REGULATING_DATA,
  SUPPORTING_DATA,
  CULTURAL_DATA,
  UsageStatus,
  ProvisioningItem,
  RegulatingItem,
  SupportingItem,
  CulturalItem,
} from '../mock/dataMasterMock';

// ─── Types ───────────────────────────────────────────────────────────────────

type TabType = 'provisioning' | 'regulating' | 'supporting' | 'cultural';
type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  key: string;
  direction: SortDirection;
}

const ITEMS_PER_PAGE = 8;

// ─── Helper: Usage Badge ─────────────────────────────────────────────────────

const UsageBadge: React.FC<{ usage: UsageStatus }> = ({ usage }) => {
  if (!usage.used) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Belum Digunakan
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Digunakan
      </span>
      <span className="text-[10px] text-blue-600 font-medium">
        {usage.indexCode} → {usage.indexName}
      </span>
    </div>
  );
};

// ─── Helper: Action Button ───────────────────────────────────────────────────

const ActionButton: React.FC<{
  usage: UsageStatus;
  onToggle: () => void;
}> = ({ usage, onToggle }) => {
  if (usage.used) {
    return (
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
        title="Lihat detail penggunaan"
      >
        <Eye className="w-3.5 h-3.5" />
        Detail
      </button>
    );
  }
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
      title="Gunakan data ini dalam project"
    >
      <PlusCircle className="w-3.5 h-3.5" />
      Gunakan
    </button>
  );
};

// ─── Helper: Pagination ──────────────────────────────────────────────────────

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, totalItems, onPageChange }) => {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  return (
    <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
      <span className="text-[11px] text-slate-500">
        Menampilkan <strong>{start}</strong>–<strong>{end}</strong> dari <strong>{totalItems}</strong> data
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
              page === currentPage
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Helper: Filter Select ───────────────────────────────────────────────────

const FilterSelect: React.FC<{
  label: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs font-semibold text-slate-800 cursor-pointer hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors min-w-[160px]"
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  </div>
);

// ─── Helper: Table Container ─────────────────────────────────────────────────

const TableContainer: React.FC<{
  title: string;
  count: number;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  children: React.ReactNode;
}> = ({ title, count, searchTerm, onSearchChange, children }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
          {count} data
        </span>
      </div>
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari data..."
          className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors w-full sm:w-56"
        />
      </div>
    </div>
    {children}
  </div>
);

// ─── Helper: Add Row Button ──────────────────────────────────────────────────

const AddRowButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <div className="px-4 py-3 border-t border-dashed border-slate-200 bg-slate-50/40">
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer w-full justify-center sm:w-auto shadow-2xs"
    >
      <PlusCircle className="w-4 h-4" />
      {label}
    </button>
  </div>
);

// ─── Table Head Style & Sortable TH ──────────────────────────────────────────

const thClass = 'py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600';
const tdClass = 'py-3 px-4 text-xs';

interface SortableThProps {
  label: string;
  sortKey: string;
  currentSort: SortState;
  onSort: (key: string) => void;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

const SortableTh: React.FC<SortableThProps> = ({
  label,
  sortKey,
  currentSort,
  onSort,
  className = '',
  align = 'left',
}) => {
  const isSorted = currentSort.key === sortKey && currentSort.direction !== null;

  return (
    <th
      onClick={() => onSort(sortKey)}
      className={`${thClass} select-none cursor-pointer hover:bg-slate-200/70 transition-colors ${
        isSorted ? 'text-blue-600 bg-blue-50/60' : ''
      } ${className}`}
      title={`Klik untuk mengurutkan berdasarkan ${label}`}
    >
      <div
        className={`inline-flex items-center gap-1.5 group ${
          align === 'center' ? 'justify-center w-full' : align === 'right' ? 'justify-end w-full' : ''
        }`}
      >
        <span>{label}</span>
        {isSorted ? (
          currentSort.direction === 'asc' ? (
            <ArrowUp className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        )}
      </div>
    </th>
  );
};

// Generic sort comparator
function sortData<T>(items: T[], sort: SortState, customGetters?: Record<string, (item: T) => any>): T[] {
  if (!sort.direction || !sort.key) return items;

  return [...items].sort((a, b) => {
    let valA: any;
    let valB: any;

    if (customGetters && customGetters[sort.key]) {
      valA = customGetters[sort.key](a);
      valB = customGetters[sort.key](b);
    } else {
      valA = (a as any)[sort.key];
      valB = (b as any)[sort.key];
    }

    if (valA === undefined || valA === null) valA = '';
    if (valB === undefined || valB === null) valB = '';

    if (typeof valA === 'string' && typeof valB === 'string') {
      const cmp = valA.localeCompare(valB, 'id', { sensitivity: 'base' });
      return sort.direction === 'asc' ? cmp : -cmp;
    }

    if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// ─── Tab: Provisioning ──────────────────────────────────────────────────────

const ProvisioningTab: React.FC<{
  data: ProvisioningItem[];
  daerahId: string;
  ekosistemId: string;
  onAdd: (newItem: Omit<ProvisioningItem, 'id' | 'usage'>) => void;
  onToggleUsage: (id: string) => void;
}> = ({ data, daerahId, ekosistemId, onAdd, onToggleUsage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: '', direction: null });

  // Form states
  const [namaIndonesia, setNamaIndonesia] = useState('');
  const [namaLatin, setNamaLatin] = useState('');
  const [namaDaerah, setNamaDaerah] = useState('');
  const [daerahName, setDaerahName] = useState(
    DAERAH_OPTIONS.find((d) => d.id === daerahId)?.label || 'Jakarta'
  );

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: '', direction: null };
      }
      return { key, direction: 'asc' };
    });
  };

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (item.daerahId !== daerahId) return false;
      if (item.ekosistemId !== ekosistemId) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          item.namaIndonesia.toLowerCase().includes(term) ||
          item.namaLatin.toLowerCase().includes(term) ||
          item.namaDaerah.toLowerCase().includes(term) ||
          item.daerah.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [data, daerahId, ekosistemId, searchTerm]);

  const sorted = useMemo(() => {
    return sortData<ProvisioningItem>(filtered, sort, {
      usage: (item) => (item.usage.used ? `1_${item.usage.indexCode}` : '0_belum'),
    });
  }, [filtered, sort]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paged = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaIndonesia.trim()) return;
    onAdd({
      namaIndonesia,
      namaLatin: namaLatin || '-',
      namaDaerah: namaDaerah || '-',
      daerah: daerahName,
      daerahId,
      ekosistemId,
    });
    setNamaIndonesia('');
    setNamaLatin('');
    setNamaDaerah('');
    setIsAdding(false);
  };

  return (
    <TableContainer
      title="Data Provisioning"
      count={sorted.length}
      searchTerm={searchTerm}
      onSearchChange={(v) => {
        setSearchTerm(v);
        setPage(1);
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <th className={`${thClass} w-12 text-center`}>No</th>
              <SortableTh label="Bahasa Indonesia" sortKey="namaIndonesia" currentSort={sort} onSort={handleSort} />
              <SortableTh label="Bahasa Latin" sortKey="namaLatin" currentSort={sort} onSort={handleSort} />
              <SortableTh label="Nama Daerah" sortKey="namaDaerah" currentSort={sort} onSort={handleSort} />
              <SortableTh label="Daerah" sortKey="daerah" currentSort={sort} onSort={handleSort} />
              <SortableTh label="Digunakan pada Index & Tutupan Lahan" sortKey="usage" currentSort={sort} onSort={handleSort} />
              <th className={`${thClass} text-center w-28`}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isAdding && (
              <tr className="bg-blue-50/50">
                <td className={`${tdClass} text-center font-mono text-blue-600 font-bold`}>+</td>
                <td className={tdClass}>
                  <input
                    type="text"
                    placeholder="Nama Indonesia *"
                    value={namaIndonesia}
                    onChange={(e) => setNamaIndonesia(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                </td>
                <td className={tdClass}>
                  <input
                    type="text"
                    placeholder="Nama Latin"
                    value={namaLatin}
                    onChange={(e) => setNamaLatin(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white focus:outline-none"
                  />
                </td>
                <td className={tdClass}>
                  <input
                    type="text"
                    placeholder="Nama Daerah"
                    value={namaDaerah}
                    onChange={(e) => setNamaDaerah(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white focus:outline-none"
                  />
                </td>
                <td className={tdClass}>
                  <input
                    type="text"
                    placeholder="Daerah"
                    value={daerahName}
                    onChange={(e) => setDaerahName(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white focus:outline-none"
                  />
                </td>
                <td className={`${tdClass} text-slate-400 italic text-[11px]`}>Belum Digunakan</td>
                <td className={`${tdClass} text-center`}>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={handleSave}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      title="Simpan"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                      title="Batal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {paged.length === 0 && !isAdding && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
            {paged.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                <td className={`${tdClass} text-center font-mono text-slate-400`}>
                  {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                </td>
                <td className={`${tdClass} font-semibold text-slate-900`}>{item.namaIndonesia}</td>
                <td className={`${tdClass} italic text-slate-600`}>{item.namaLatin}</td>
                <td className={`${tdClass} text-slate-600`}>{item.namaDaerah}</td>
                <td className={`${tdClass} text-slate-600`}>{item.daerah}</td>
                <td className={tdClass}>
                  <UsageBadge usage={item.usage} />
                </td>
                <td className={`${tdClass} text-center`}>
                  <ActionButton usage={item.usage} onToggle={() => onToggleUsage(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddRowButton label="Tambah Data Provisioning" onClick={() => setIsAdding(true)} />
      <Pagination currentPage={page} totalPages={totalPages} totalItems={sorted.length} onPageChange={setPage} />
    </TableContainer>
  );
};

// ─── Tab: Regulating ─────────────────────────────────────────────────────────

const RegulatingTab: React.FC<{
  data: RegulatingItem[];
  daerahId: string;
  ekosistemId: string;
  onAdd: (newItem: Omit<RegulatingItem, 'id' | 'usage'>) => void;
  onToggleUsage: (id: string) => void;
}> = ({ data, daerahId, ekosistemId, onAdd, onToggleUsage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: '', direction: null });

  const [namaParameter, setNamaParameter] = useState('');
  const [daerahName, setDaerahName] = useState(
    DAERAH_OPTIONS.find((d) => d.id === daerahId)?.label || 'Jakarta'
  );

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: '', direction: null };
      }
      return { key, direction: 'asc' };
    });
  };

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (item.daerahId !== daerahId) return false;
      if (item.ekosistemId !== ekosistemId) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          item.namaParameter.toLowerCase().includes(term) ||
          item.daerah.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [data, daerahId, ekosistemId, searchTerm]);

  const sorted = useMemo(() => {
    return sortData<RegulatingItem>(filtered, sort, {
      usage: (item) => (item.usage.used ? `1_${item.usage.indexCode}` : '0_belum'),
    });
  }, [filtered, sort]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paged = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaParameter.trim()) return;
    onAdd({
      namaParameter,
      daerah: daerahName,
      daerahId,
      ekosistemId,
    });
    setNamaParameter('');
    setIsAdding(false);
  };

  return (
    <TableContainer
      title="Data Regulating"
      count={sorted.length}
      searchTerm={searchTerm}
      onSearchChange={(v) => {
        setSearchTerm(v);
        setPage(1);
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <th className={`${thClass} w-12 text-center`}>No</th>
              <SortableTh label="Nama Data / Parameter" sortKey="namaParameter" currentSort={sort} onSort={handleSort} />
              <SortableTh label="Daerah" sortKey="daerah" currentSort={sort} onSort={handleSort} />
              <SortableTh label="Digunakan pada Index & Tutupan Lahan" sortKey="usage" currentSort={sort} onSort={handleSort} />
              <th className={`${thClass} text-center w-28`}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isAdding && (
              <tr className="bg-blue-50/50">
                <td className={`${tdClass} text-center font-mono text-blue-600 font-bold`}>+</td>
                <td className={tdClass}>
                  <input
                    type="text"
                    placeholder="Contoh: Pencegah erosi, Penyerapan air *"
                    value={namaParameter}
                    onChange={(e) => setNamaParameter(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                </td>
                <td className={tdClass}>
                  <input
                    type="text"
                    placeholder="Daerah"
                    value={daerahName}
                    onChange={(e) => setDaerahName(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white focus:outline-none"
                  />
                </td>
                <td className={`${tdClass} text-slate-400 italic text-[11px]`}>Belum Digunakan</td>
                <td className={`${tdClass} text-center`}>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={handleSave}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      title="Simpan"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                      title="Batal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {paged.length === 0 && !isAdding && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-xs text-slate-400">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
            {paged.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                <td className={`${tdClass} text-center font-mono text-slate-400`}>
                  {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                </td>
                <td className={`${tdClass} font-semibold text-slate-900`}>{item.namaParameter}</td>
                <td className={`${tdClass} text-slate-600`}>{item.daerah}</td>
                <td className={tdClass}>
                  <UsageBadge usage={item.usage} />
                </td>
                <td className={`${tdClass} text-center`}>
                  <ActionButton usage={item.usage} onToggle={() => onToggleUsage(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddRowButton label="Tambah Data Regulating" onClick={() => setIsAdding(true)} />
      <Pagination currentPage={page} totalPages={totalPages} totalItems={sorted.length} onPageChange={setPage} />
    </TableContainer>
  );
};

// ─── Tab: Supporting ─────────────────────────────────────────────────────────

const SupportingTab: React.FC<{
  data: SupportingItem[];
  daerahId: string;
  ekosistemId: string;
  onAdd: (newItem: Omit<SupportingItem, 'id' | 'usage'>) => void;
  onToggleUsage: (id: string) => void;
}> = ({ data, daerahId, ekosistemId, onAdd, onToggleUsage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: '', direction: null });

  // Form states
  const [klasifikasi, setKlasifikasi] = useState('Habitat • Reptil');
  const [daerahName, setDaerahName] = useState(
    DAERAH_OPTIONS.find((d) => d.id === daerahId)?.label || 'Jakarta'
  );

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: '', direction: null };
      }
      return { key, direction: 'asc' };
    });
  };

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (item.daerahId !== daerahId) return false;
      if (item.ekosistemId !== ekosistemId) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          item.klasifikasi.toLowerCase().includes(term) ||
          item.daerah.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [data, daerahId, ekosistemId, searchTerm]);

  const sorted = useMemo(() => {
    return sortData<SupportingItem>(filtered, sort, {
      usage: (item) => (item.usage.used ? `1_${item.usage.indexCode}` : '0_belum'),
    });
  }, [filtered, sort]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paged = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!klasifikasi.trim()) return;
    onAdd({
      klasifikasi,
      daerah: daerahName,
      daerahId,
      ekosistemId,
    });
    setIsAdding(false);
  };

  return (
    <TableContainer
      title="Data Supporting — Jasa Pendukung"
      count={sorted.length}
      searchTerm={searchTerm}
      onSearchChange={(v) => {
        setSearchTerm(v);
        setPage(1);
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <th className={`${thClass} w-12 text-center`}>No</th>
              <SortableTh
                label="Nama"
                sortKey="klasifikasi"
                currentSort={sort}
                onSort={handleSort}
              />
              <SortableTh label="Daerah" sortKey="daerah" currentSort={sort} onSort={handleSort} />
              <SortableTh
                label="Digunakan pada Index & Tutupan Lahan"
                sortKey="usage"
                currentSort={sort}
                onSort={handleSort}
              />
              <th className={`${thClass} text-center w-28`}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isAdding && (
              <tr className="bg-blue-50/50">
                <td className={`${tdClass} text-center font-mono text-blue-600 font-bold`}>+</td>
                <td className={tdClass}>
                  <select
                    value={klasifikasi}
                    onChange={(e) => setKlasifikasi(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-blue-300 rounded bg-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  >
                    <option value="Habitat • Reptil">Habitat • Reptil</option>
                    <option value="Habitat • Burung">Habitat • Burung</option>
                    <option value="Habitat • Mamalia">Habitat • Mamalia</option>
                    <option value="Nursery Ground">Nursery Ground</option>
                    <option value="Pembentukan Tanah">Pembentukan Tanah</option>
                    <option value="Biodiversitas">Biodiversitas</option>
                  </select>
                </td>
                <td className={tdClass}>
                  <input
                    type="text"
                    placeholder="Daerah"
                    value={daerahName}
                    onChange={(e) => setDaerahName(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white focus:outline-none"
                  />
                </td>
                <td className={`${tdClass} text-slate-400 italic text-[11px]`}>Belum Digunakan</td>
                <td className={`${tdClass} text-center`}>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={handleSave}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      title="Simpan"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                      title="Batal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {paged.length === 0 && !isAdding && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-xs text-slate-400">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
            {paged.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                <td className={`${tdClass} text-center font-mono text-slate-400`}>
                  {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                </td>
                <td className={`${tdClass} font-semibold text-slate-900`}>
                  {item.klasifikasi}
                </td>
                <td className={`${tdClass} text-slate-600`}>{item.daerah}</td>
                <td className={tdClass}>
                  <UsageBadge usage={item.usage} />
                </td>
                <td className={`${tdClass} text-center`}>
                  <ActionButton usage={item.usage} onToggle={() => onToggleUsage(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddRowButton label="Tambah Data Supporting" onClick={() => setIsAdding(true)} />
      <Pagination currentPage={page} totalPages={totalPages} totalItems={sorted.length} onPageChange={setPage} />
    </TableContainer>
  );
};

// ─── Tab: Cultural ───────────────────────────────────────────────────────────

const CulturalTab: React.FC<{
  data: CulturalItem[];
  daerahId: string;
  ekosistemId: string;
  onAdd: (newItem: Omit<CulturalItem, 'id' | 'usage'>) => void;
  onToggleUsage: (id: string) => void;
}> = ({ data, daerahId, ekosistemId, onAdd, onToggleUsage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: '', direction: null });

  const [namaObjek, setNamaObjek] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [daerahName, setDaerahName] = useState(
    DAERAH_OPTIONS.find((d) => d.id === daerahId)?.label || 'Jakarta'
  );

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: '', direction: null };
      }
      return { key, direction: 'asc' };
    });
  };

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (item.daerahId !== daerahId) return false;
      if (item.ekosistemId !== ekosistemId) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          item.namaObjek.toLowerCase().includes(term) ||
          item.deskripsi.toLowerCase().includes(term) ||
          item.daerah.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [data, daerahId, ekosistemId, searchTerm]);

  const sorted = useMemo(() => {
    return sortData<CulturalItem>(filtered, sort, {
      usage: (item) => (item.usage.used ? `1_${item.usage.indexCode}` : '0_belum'),
    });
  }, [filtered, sort]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paged = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaObjek.trim()) return;
    onAdd({
      namaObjek,
      deskripsi: deskripsi || '-',
      daerah: daerahName,
      daerahId,
      ekosistemId,
    });
    setNamaObjek('');
    setDeskripsi('');
    setIsAdding(false);
  };

  return (
    <TableContainer
      title="Data Cultural"
      count={sorted.length}
      searchTerm={searchTerm}
      onSearchChange={(v) => {
        setSearchTerm(v);
        setPage(1);
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <th className={`${thClass} w-12 text-center`}>No</th>
              <SortableTh label="Nama Data / Objek" sortKey="namaObjek" currentSort={sort} onSort={handleSort} />
              <SortableTh label="Deskripsi" sortKey="deskripsi" currentSort={sort} onSort={handleSort} />
              <SortableTh label="Daerah" sortKey="daerah" currentSort={sort} onSort={handleSort} />
              <SortableTh label="Digunakan pada Index & Tutupan Lahan" sortKey="usage" currentSort={sort} onSort={handleSort} />
              <th className={`${thClass} text-center w-28`}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isAdding && (
              <tr className="bg-blue-50/50">
                <td className={`${tdClass} text-center font-mono text-blue-600 font-bold`}>+</td>
                <td className={tdClass}>
                  <input
                    type="text"
                    placeholder="Nama Data / Objek *"
                    value={namaObjek}
                    onChange={(e) => setNamaObjek(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                </td>
                <td className={tdClass}>
                  <input
                    type="text"
                    placeholder="Deskripsi"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white focus:outline-none"
                  />
                </td>
                <td className={tdClass}>
                  <input
                    type="text"
                    placeholder="Daerah"
                    value={daerahName}
                    onChange={(e) => setDaerahName(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white focus:outline-none"
                  />
                </td>
                <td className={`${tdClass} text-slate-400 italic text-[11px]`}>Belum Digunakan</td>
                <td className={`${tdClass} text-center`}>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={handleSave}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      title="Simpan"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                      title="Batal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {paged.length === 0 && !isAdding && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
            {paged.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                <td className={`${tdClass} text-center font-mono text-slate-400`}>
                  {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                </td>
                <td className={`${tdClass} font-semibold text-slate-900`}>{item.namaObjek}</td>
                <td className={`${tdClass} text-slate-500 max-w-[240px] truncate`}>{item.deskripsi}</td>
                <td className={`${tdClass} text-slate-600`}>{item.daerah}</td>
                <td className={tdClass}>
                  <UsageBadge usage={item.usage} />
                </td>
                <td className={`${tdClass} text-center`}>
                  <ActionButton usage={item.usage} onToggle={() => onToggleUsage(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddRowButton label="Tambah Data Cultural" onClick={() => setIsAdding(true)} />
      <Pagination currentPage={page} totalPages={totalPages} totalItems={sorted.length} onPageChange={setPage} />
    </TableContainer>
  );
};

// ─── Tab Config ──────────────────────────────────────────────────────────────

const TABS: { key: TabType; label: string; icon: React.ReactNode }[] = [
  { key: 'provisioning', label: 'Provisioning', icon: <Leaf className="w-4 h-4" /> },
  { key: 'regulating', label: 'Regulating', icon: <Shield className="w-4 h-4" /> },
  { key: 'supporting', label: 'Supporting', icon: <Heart className="w-4 h-4" /> },
  { key: 'cultural', label: 'Cultural', icon: <Palette className="w-4 h-4" /> },
];

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export const DataMasterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('provisioning');
  const [selectedDaerah, setSelectedDaerah] = useState('jakarta');
  const [selectedEkosistem, setSelectedEkosistem] = useState('lamun');

  // Dynamic state for master data so users can add rows live
  const [provisioningList, setProvisioningList] = useState<ProvisioningItem[]>(PROVISIONING_DATA);
  const [regulatingList, setRegulatingList] = useState<RegulatingItem[]>(REGULATING_DATA);
  const [supportingList, setSupportingList] = useState<SupportingItem[]>(SUPPORTING_DATA);
  const [culturalList, setCulturalList] = useState<CulturalItem[]>(CULTURAL_DATA);

  // Handlers for adding new data
  const handleAddProvisioning = (newItem: Omit<ProvisioningItem, 'id' | 'usage'>) => {
    const item: ProvisioningItem = {
      ...newItem,
      id: `prov-${Date.now()}`,
      usage: { used: false },
    };
    setProvisioningList((prev) => [item, ...prev]);
  };

  const handleAddRegulating = (newItem: Omit<RegulatingItem, 'id' | 'usage'>) => {
    const item: RegulatingItem = {
      ...newItem,
      id: `reg-${Date.now()}`,
      usage: { used: false },
    };
    setRegulatingList((prev) => [item, ...prev]);
  };

  const handleAddSupporting = (newItem: Omit<SupportingItem, 'id' | 'usage'>) => {
    const item: SupportingItem = {
      ...newItem,
      id: `sup-${Date.now()}`,
      usage: { used: false },
    };
    setSupportingList((prev) => [item, ...prev]);
  };

  const handleAddCultural = (newItem: Omit<CulturalItem, 'id' | 'usage'>) => {
    const item: CulturalItem = {
      ...newItem,
      id: `cul-${Date.now()}`,
      usage: { used: false },
    };
    setCulturalList((prev) => [item, ...prev]);
  };

  // Handlers for toggling usage status
  const handleToggleUsage = (tab: TabType, id: string) => {
    if (tab === 'provisioning') {
      setProvisioningList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                usage: item.usage.used
                  ? { used: false }
                  : { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
              }
            : item
        )
      );
    } else if (tab === 'regulating') {
      setRegulatingList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                usage: item.usage.used
                  ? { used: false }
                  : { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
              }
            : item
        )
      );
    } else if (tab === 'supporting') {
      setSupportingList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                usage: item.usage.used
                  ? { used: false }
                  : { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
              }
            : item
        )
      );
    } else if (tab === 'cultural') {
      setCulturalList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                usage: item.usage.used
                  ? { used: false }
                  : { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
              }
            : item
        )
      );
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          {/* Title & Description */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Database className="w-6 h-6 text-blue-600" />
              <span>Data Master</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-xl">
              Kelola dan lihat data master yang tersedia untuk kebutuhan valuasi jasa ekosistem.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-end gap-3">
            <FilterSelect
              label="Daerah Penelitian"
              value={selectedDaerah}
              options={DAERAH_OPTIONS}
              onChange={setSelectedDaerah}
            />
            <FilterSelect
              label="Ekosistem"
              value={selectedEkosistem}
              options={EKOSISTEM_OPTIONS}
              onChange={setSelectedEkosistem}
            />
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      {activeTab === 'provisioning' && (
        <ProvisioningTab
          data={provisioningList}
          daerahId={selectedDaerah}
          ekosistemId={selectedEkosistem}
          onAdd={handleAddProvisioning}
          onToggleUsage={(id) => handleToggleUsage('provisioning', id)}
        />
      )}
      {activeTab === 'regulating' && (
        <RegulatingTab
          data={regulatingList}
          daerahId={selectedDaerah}
          ekosistemId={selectedEkosistem}
          onAdd={handleAddRegulating}
          onToggleUsage={(id) => handleToggleUsage('regulating', id)}
        />
      )}
      {activeTab === 'supporting' && (
        <SupportingTab
          data={supportingList}
          daerahId={selectedDaerah}
          ekosistemId={selectedEkosistem}
          onAdd={handleAddSupporting}
          onToggleUsage={(id) => handleToggleUsage('supporting', id)}
        />
      )}
      {activeTab === 'cultural' && (
        <CulturalTab
          data={culturalList}
          daerahId={selectedDaerah}
          ekosistemId={selectedEkosistem}
          onAdd={handleAddCultural}
          onToggleUsage={(id) => handleToggleUsage('cultural', id)}
        />
      )}
    </div>
  );
};
