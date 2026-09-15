import React, { useState } from 'react';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { useProject } from '../../context/ProjectContext';
import { getMethodSchema, ColumnDefinition, CustomColumnDefinition, CustomColumnType } from '../../types/methodSchemas';
import { ECOSYSTEM_SERVICES_CONFIG } from '../../mock/valuationMock';
import { downloadContextTemplate } from '../../utils/excelEngine';
import { formatIDR } from '../../utils/formatter';
import { CustomColumnModal } from './CustomColumnModal';
import { DeleteColumnConfirmModal } from './DeleteColumnConfirmModal';
import { FormattedNumberInput } from './FormattedNumberInput';
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Download,
  Upload,
  Trash2,
  Columns3,
  Pencil,
  Lock
} from 'lucide-react';

interface DynamicServiceSectionProps {
  projectId?: string;
  prefixLetter: 'A' | 'B' | 'C' | 'D';
  serviceId: 'provisioning' | 'regulating' | 'supporting' | 'cultural';
  serviceName: string;
  methodId: string;
  biota?: 'flora' | 'fauna';
  areaId: string;
  areaName: string;
  areaHa: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  onMethodChange: (newMethodId: string) => void;
  onBiotaChange?: (newBiota: 'flora' | 'fauna') => void;
  onOpenImportModal: (service: string, method: string, category: string) => void;
  highlightedRowId?: string | null;
}

export const DynamicServiceSection: React.FC<DynamicServiceSectionProps> = ({
  projectId,
  prefixLetter,
  serviceId,
  serviceName,
  methodId,
  biota = 'flora',
  areaId,
  areaName,
  areaHa,
  isOpen,
  onToggleOpen,
  onMethodChange,
  onBiotaChange,
  onOpenImportModal,
  highlightedRowId,
}) => {
  const { activeProjectId } = useProject();
  const currentProjId = projectId || activeProjectId;
  const {
    getRows,
    updateCell,
    addRow,
    deleteRow,
    getCustomColumns,
    addCustomColumn,
    updateCustomColumn,
    deleteCustomColumn,
  } = useSpreadsheet();

  // Retrieve schema based on service, method, and biota
  const schema = getMethodSchema(serviceId, methodId, serviceId === 'provisioning' ? biota : undefined);
  const rows = getRows(currentProjId, areaId, serviceId, methodId, serviceId === 'provisioning' ? biota : undefined);
  const customColumns = getCustomColumns(currentProjId, areaId, serviceId, methodId, serviceId === 'provisioning' ? biota : undefined);

  // Modal states for Custom Columns
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<CustomColumnDefinition | null>(null);
  const [deletingColumn, setDeletingColumn] = useState<CustomColumnDefinition | null>(null);

  // Category visual accent tokens
  const ACCENT_STYLES: Record<string, { badgeBg: string; badgeText: string; borderLeft: string; pillBg: string; pillText: string }> = {
    provisioning: { badgeBg: 'bg-cyan-100', badgeText: 'text-cyan-800', borderLeft: 'border-l-cyan-600', pillBg: 'bg-cyan-50', pillText: 'text-cyan-700' },
    regulating: { badgeBg: 'bg-blue-100', badgeText: 'text-blue-800', borderLeft: 'border-l-blue-600', pillBg: 'bg-blue-50', pillText: 'text-blue-700' },
    supporting: { badgeBg: 'bg-purple-100', badgeText: 'text-purple-800', borderLeft: 'border-l-purple-600', pillBg: 'bg-purple-50', pillText: 'text-purple-700' },
    cultural: { badgeBg: 'bg-amber-100', badgeText: 'text-amber-800', borderLeft: 'border-l-amber-600', pillBg: 'bg-amber-50', pillText: 'text-amber-700' },
  };

  const accent = ACCENT_STYLES[serviceId] || ACCENT_STYLES.provisioning;

  // Available methods for this service from master config
  const serviceConfig = ECOSYSTEM_SERVICES_CONFIG.find(s => s.id === serviceId);
  const availableMethods = serviceConfig?.methods || [];

  // System columns from schema, excluding 'no' which is rendered as dedicated 1-based index column
  const systemColumns = schema.columns.filter(col => col.key !== 'no');

  // Helper to dynamically calculate row's economic value
  const getRowTotal = (row: Record<string, any>): number => {
    if (row.totalNilai !== undefined && row.totalNilai !== null && !isNaN(Number(row.totalNilai)) && Number(row.totalNilai) > 0) {
      return Number(row.totalNilai);
    }
    const calc = schema.calculateRow(row);
    return (calc && typeof calc.total === 'number' && !isNaN(calc.total)) ? calc.total : 0;
  };

  // Dynamic sum of all rows in this category
  const categoryTotal = rows.reduce((acc, row) => acc + getRowTotal(row), 0);

  // Column spanning calculation for table footer
  const totalColIndex = systemColumns.findIndex(col => col.key === 'totalNilai');
  const leadingColSpan = 1 + (totalColIndex >= 0 ? totalColIndex : systemColumns.length);
  const remainingColSpan = (totalColIndex >= 0 ? systemColumns.length - 1 - totalColIndex : 0) + customColumns.length + 1;

  const serviceCategoryTitle =
    serviceId === 'provisioning' ? 'PROVISIONING SERVICES' :
    serviceId === 'regulating' ? 'REGULATING SERVICES' :
    serviceId === 'supporting' ? 'SUPPORTING SERVICES' :
    'CULTURAL SERVICES';

  // Collect all existing column labels (system + custom) to prevent duplicate names
  const existingColumnLabels = [
    'No',
    ...systemColumns.map(c => c.label),
    ...customColumns.map(c => c.label)
  ];

  const handleDownloadTemplate = () => {
    downloadContextTemplate(
      serviceId === 'provisioning' ? 'Provisioning' : serviceName.replace(/\s+/g, ''),
      schema.methodName.replace(/\s+/g, ''),
      serviceId === 'provisioning' ? (biota === 'fauna' ? 'Fauna' : 'Flora') : 'General'
    );
  };

  const handleAddRow = () => {
    addRow(currentProjId, areaId, serviceId, methodId, serviceId === 'provisioning' ? biota : undefined, areaHa);
  };

  const handleDeleteRow = (rowId: string) => {
    deleteRow(currentProjId, areaId, serviceId, methodId, serviceId === 'provisioning' ? biota : 'none', rowId);
  };

  const handleCellChange = (rowId: string, colKey: string, val: any) => {
    updateCell(currentProjId, areaId, serviceId, methodId, serviceId === 'provisioning' ? biota : 'none', rowId, colKey, val);
  };

  const handleSaveCustomColumn = (data: { label: string; type: CustomColumnType; required: boolean }) => {
    if (editingColumn) {
      updateCustomColumn(
        currentProjId,
        areaId,
        serviceId,
        methodId,
        serviceId === 'provisioning' ? biota : undefined,
        editingColumn.id,
        {
          label: data.label,
          type: data.type,
          required: data.required
        }
      );
    } else {
      addCustomColumn(
        currentProjId,
        areaId,
        serviceId,
        methodId,
        serviceId === 'provisioning' ? biota : undefined,
        data
      );
    }
    setEditingColumn(null);
  };

  const handleConfirmDeleteColumn = () => {
    if (deletingColumn) {
      deleteCustomColumn(
        currentProjId,
        areaId,
        serviceId,
        methodId,
        serviceId === 'provisioning' ? biota : undefined,
        deletingColumn.id
      );
      setDeletingColumn(null);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden transition-all border-l-4 ${accent.borderLeft}`}>
      {/* Accordion Header */}
      <div
        onClick={onToggleOpen}
        className="p-4 bg-slate-50/90 hover:bg-slate-100/80 cursor-pointer flex items-center justify-between gap-3 select-none transition-colors border-b border-slate-200"
      >
        <div className="flex items-center gap-3">
          {/* Prefix Letter Badge */}
          <span className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs ${accent.badgeBg} ${accent.badgeText} shadow-xs flex-shrink-0`}>
            {prefixLetter}
          </span>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">
                {prefixLetter}. {serviceName}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${accent.pillBg} ${accent.pillText} border border-slate-200/60 hidden sm:inline-block`}>
                {schema.methodName}
              </span>
              {customColumns.length > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 hidden md:inline-block">
                  +{customColumns.length} Kolom Custom
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Area: <strong className="text-slate-700">{areaName}</strong> • {schema.subtitle}
            </div>
          </div>
        </div>

        {/* Right: Item Count (No Subtotal Calculation) & Accordion Chevron Toggle */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
              {rows.length} item
            </span>
          </div>

          <button
            type="button"
            className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Accordion Body / Spreadsheet Workspace */}
      {isOpen && (
        <div className="p-4 space-y-3 bg-white animate-in slide-in-from-top-1 duration-150">
          {/* Optional sub-header for Provisioning: A.1 FLORA / A.2 FAUNA */}
          {serviceId === 'provisioning' && (
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
              <span>A.1 {biota === 'flora' ? 'FLORA' : 'FAUNA'}</span>
            </div>
          )}

          {/* Sub-toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 text-xs">
            {/* Left: Method Selector Dropdown & Biota toggle */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Metode Valuasi:</span>
                <select
                  value={methodId}
                  onChange={(e) => onMethodChange(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  {availableMethods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — ({m.subtitle})
                    </option>
                  ))}
                </select>
              </div>

              {/* Flora / Fauna Toggle for Provisioning */}
              {serviceId === 'provisioning' && onBiotaChange && (
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                  <span className="text-slate-500 font-semibold">Biota:</span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 cursor-pointer font-medium text-slate-700">
                      <input
                        type="radio"
                        name={`biota-sec-${serviceId}-${areaId}`}
                        checked={biota === 'flora'}
                        onChange={() => onBiotaChange('flora')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Flora</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer font-medium text-slate-700">
                      <input
                        type="radio"
                        name={`biota-sec-${serviceId}-${areaId}`}
                        checked={biota === 'fauna'}
                        onChange={() => onBiotaChange('fauna')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Fauna</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Section Action Buttons: [ + Tambah Baris ] [ + Tambah Kolom ] [ Import Excel ] [ Download Template ] */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={handleAddRow}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Baris</span>
              </button>

              <button
                onClick={() => {
                  setEditingColumn(null);
                  setIsColumnModalOpen(true);
                }}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Tambah variabel atau kolom baru ke lembar kerja ini"
              >
                <Columns3 className="w-3.5 h-3.5 text-blue-600" />
                <span>+ Tambah Kolom</span>
              </button>

              <button
                onClick={() => onOpenImportModal(serviceName, schema.methodName, biota)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title={`Import Excel khusus template ${schema.templateFileName}`}
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Import Excel</span>
              </button>

              <button
                onClick={handleDownloadTemplate}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title={`Download template resmi ${schema.templateFileName}`}
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download Template</span>
              </button>
            </div>
          </div>

          {/* Dynamic Grid Table (Input Columns + Custom Columns) */}
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-left border-collapse text-xs select-text">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] select-none">
                  <th className="py-2.5 px-3 w-12 text-center border-r border-slate-200">No</th>

                  {/* 1. SYSTEM COLUMNS (INCLUDING CALCULATED TOTAL NILAI EKONOMI) */}
                  {systemColumns.map((col: ColumnDefinition) => {
                    if (col.key === 'totalNilai' || col.type === 'readonly_calculated') {
                      return (
                        <th
                          key={col.key}
                          className="py-2.5 px-3 min-w-[180px] text-right border-r border-slate-200 bg-slate-200/50 text-slate-900 font-bold select-none"
                        >
                          <span className="flex items-center justify-end gap-1">
                            <Lock className="w-3 h-3 text-slate-500" />
                            Total Nilai Ekonomi (Rp)
                          </span>
                        </th>
                      );
                    }

                    return (
                      <th
                        key={col.key}
                        className={`py-2.5 px-3 border-r border-slate-200 ${col.width || ''} text-${col.align || 'left'}`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span>{col.label} {col.unit ? `(${col.unit})` : ''}</span>
                        </div>
                      </th>
                    );
                  })}

                  {/* 2. CUSTOM COLUMNS (USER DEFINED, MARKED AS CUSTOM, EDITABLE & DELETABLE) */}
                  {customColumns.map((col: CustomColumnDefinition) => (
                    <th
                      key={col.key}
                      className="py-2 px-3 border-r border-slate-200 min-w-[170px] bg-slate-100/90 text-left select-none group"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="truncate font-semibold text-slate-800" title={col.label}>
                            {col.label}
                          </span>
                          {col.required && (
                            <span className="text-rose-500 font-bold" title="Wajib diisi">*</span>
                          )}
                          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded shrink-0">
                            Custom
                          </span>
                        </div>

                        {/* Subtle Header Actions: Edit & Delete */}
                        <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingColumn(col);
                              setIsColumnModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
                            title="Edit nama atau tipe data kolom"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingColumn(col);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus kolom ini"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}

                  {/* 3. ROW ACTION COLUMN */}
                  <th className="py-2.5 px-3 w-14 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={1 + systemColumns.length + customColumns.length + 1}
                      className="py-10 text-center text-slate-400 italic"
                    >
                      Belum ada baris data. Klik <strong>"+ Tambah Baris"</strong> untuk memulai pengisian data {serviceName}.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, rIdx) => {
                    const isHighlighted = highlightedRowId === row.id || highlightedRowId === String(row.no);

                    return (
                      <tr
                        key={row.id || rIdx}
                        className={`hover:bg-blue-50/30 transition-colors ${
                          isHighlighted ? 'bg-rose-50 border-2 border-rose-500' : ''
                        }`}
                      >
                        <td className="py-2 px-3 text-center font-mono text-slate-400 border-r border-slate-200 bg-slate-50/50">
                          {rIdx + 1}
                        </td>

                        {/* 1. Render System Column Cells */}
                        {systemColumns.map((col: ColumnDefinition) => {
                          const val = row[col.key];

                          // Read-only Calculated Total Nilai Ekonomi
                          if (col.key === 'totalNilai' || col.type === 'readonly_calculated') {
                            return (
                              <td
                                key={col.key}
                                className="py-2 px-3 border-r border-slate-200 text-right bg-slate-50 font-mono font-bold text-slate-900 select-all"
                              >
                                {formatIDR(getRowTotal(row))}
                              </td>
                            );
                          }

                          // Number Column (Indonesian Excel-style formatting)
                          if (col.type === 'number') {
                            return (
                              <td key={col.key} className="py-1 px-2 border-r border-slate-200 text-right">
                                <FormattedNumberInput
                                  value={val}
                                  onChange={(numVal) => handleCellChange(row.id, col.key, numVal)}
                                  placeholder={col.placeholder || '0'}
                                  decimals={2}
                                  className={`w-full px-2 py-1 text-right bg-transparent hover:bg-white focus:bg-white focus:ring-1 rounded border font-mono ${
                                    isHighlighted && (col.key === 'hargaUnit' || col.key === 'hargaOutput')
                                      ? 'border-rose-400 bg-rose-50 text-rose-800 font-bold focus:ring-rose-500'
                                      : 'border-transparent hover:border-slate-300 focus:border-blue-500 text-slate-800'
                                  }`}
                                />
                              </td>
                            );
                          }

                          // Text Column
                          return (
                            <td key={col.key} className="py-1 px-2 border-r border-slate-200">
                              <input
                                type="text"
                                value={val || ''}
                                onChange={(e) => handleCellChange(row.id, col.key, e.target.value)}
                                placeholder={col.placeholder || ''}
                                className="w-full px-2 py-1 bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-blue-500 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 text-slate-800 font-medium"
                              />
                            </td>
                          );
                        })}

                        {/* 2. Render Custom Column Cells (Text, Integer, Decimal, Date, Boolean) */}
                        {customColumns.map((col: CustomColumnDefinition) => {
                          const val = row[col.key];

                          if (col.type === 'integer') {
                            return (
                              <td key={col.key} className="py-1 px-2 border-r border-slate-200 text-right">
                                <FormattedNumberInput
                                  value={val}
                                  isIntegerOnly={true}
                                  decimals={0}
                                  onChange={(numVal) => handleCellChange(row.id, col.key, numVal)}
                                  placeholder="0"
                                  className="w-full px-2 py-1 text-right bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-blue-500 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 text-slate-800 font-mono"
                                />
                              </td>
                            );
                          }

                          if (col.type === 'decimal') {
                            return (
                              <td key={col.key} className="py-1 px-2 border-r border-slate-200 text-right">
                                <FormattedNumberInput
                                  value={val}
                                  decimals={2}
                                  onChange={(numVal) => handleCellChange(row.id, col.key, numVal)}
                                  placeholder="0,00"
                                  className="w-full px-2 py-1 text-right bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-blue-500 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 text-slate-800 font-mono"
                                />
                              </td>
                            );
                          }

                          if (col.type === 'date') {
                            return (
                              <td key={col.key} className="py-1 px-2 border-r border-slate-200">
                                <input
                                  type="date"
                                  value={val || ''}
                                  onChange={(e) => handleCellChange(row.id, col.key, e.target.value)}
                                  className="w-full px-2 py-1 bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-blue-500 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 text-slate-800 font-mono text-xs"
                                />
                              </td>
                            );
                          }

                          if (col.type === 'boolean') {
                            return (
                              <td key={col.key} className="py-1 px-2 border-r border-slate-200 text-center">
                                <select
                                  value={val === true ? 'true' : val === false ? 'false' : ''}
                                  onChange={(e) => {
                                    const v = e.target.value === 'true' ? true : e.target.value === 'false' ? false : null;
                                    handleCellChange(row.id, col.key, v);
                                  }}
                                  className="w-full px-2 py-1 bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-blue-500 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 text-slate-800 text-xs cursor-pointer font-medium"
                                >
                                  <option value="">-</option>
                                  <option value="true">Ya</option>
                                  <option value="false">Tidak</option>
                                </select>
                              </td>
                            );
                          }

                          // Default text type
                          return (
                            <td key={col.key} className="py-1 px-2 border-r border-slate-200">
                              <input
                                type="text"
                                value={val || ''}
                                onChange={(e) => handleCellChange(row.id, col.key, e.target.value)}
                                placeholder={col.label}
                                className="w-full px-2 py-1 bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-blue-500 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 text-slate-800 font-medium"
                              />
                            </td>
                          );
                        })}

                        {/* 3. Action Column */}
                        <td className="py-1.5 px-2 text-center">
                          <button
                            onClick={() => handleDeleteRow(row.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                            title="Hapus baris"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Section Table Footer: Category Summary Total + Status Bar */}
              <tfoot>
                {/* 1. DYNAMIC CATEGORY TOTAL ROW */}
                <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900 select-none">
                  <td
                    colSpan={leadingColSpan}
                    className="py-3 px-4 text-right uppercase text-xs tracking-wider text-slate-800 font-bold"
                  >
                    TOTAL NILAI EKONOMI ({serviceCategoryTitle}) :
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm font-bold text-blue-800 bg-blue-50 border-x border-blue-200">
                    {formatIDR(categoryTotal)}
                  </td>
                  <td
                    colSpan={remainingColSpan}
                    className="py-3 px-3 text-xs text-slate-500 font-normal"
                  >
                    {rows.length} {serviceId === 'provisioning' ? 'komoditas' : 'item'} terhitung
                  </td>
                </tr>

                {/* 2. FORMULA INFO & AUTOSAVE STATUS BAR */}
                <tr className="bg-slate-50 border-t border-slate-200 text-slate-600 text-xs">
                  <td colSpan={1 + systemColumns.length + customColumns.length + 1} className="py-2.5 px-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span>
                          Kolom <strong>Total Nilai Ekonomi</strong> terkalkulasi otomatis berdasarkan formula: <em className="text-slate-700 font-medium">{schema.formulaDescription}</em>.
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="font-semibold text-slate-700">{rows.length} item terisi</span>
                        <span>•</span>
                        <span>✓ Semua perubahan tersimpan otomatis</span>
                        {customColumns.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600 font-medium">{customColumns.length} kolom tambahan aktif</span>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Kolom */}
      <CustomColumnModal
        isOpen={isColumnModalOpen}
        onClose={() => {
          setIsColumnModalOpen(false);
          setEditingColumn(null);
        }}
        onSave={handleSaveCustomColumn}
        editingColumn={editingColumn}
        existingColumnLabels={existingColumnLabels}
      />

      {/* Modal Konfirmasi Hapus Kolom */}
      <DeleteColumnConfirmModal
        isOpen={!!deletingColumn}
        onClose={() => setDeletingColumn(null)}
        onConfirm={handleConfirmDeleteColumn}
        column={deletingColumn}
      />
    </div>
  );
};

export default DynamicServiceSection;
