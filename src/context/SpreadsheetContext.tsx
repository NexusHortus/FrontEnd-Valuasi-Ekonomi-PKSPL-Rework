import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { getMethodSchema, MethodSchema, CustomColumnDefinition, CustomColumnType } from '../types/methodSchemas';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { formatTime } from '../utils/formatter';
import { EcosystemServiceId } from '../types/valuation';

interface SpreadsheetContextType {
  isSaving: boolean;
  lastSavedText: string;
  isOffline: boolean;
  saveError: boolean;
  getRows: (projectId: string, areaId: string, serviceId: string, methodId: string, biota?: string) => Record<string, any>[];
  updateCell: (
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string,
    rowId: string,
    field: string,
    value: any
  ) => void;
  addRow: (projectId: string, areaId: string, serviceId: string, methodId: string, biota?: string, areaHa?: number) => void;
  deleteRow: (projectId: string, areaId: string, serviceId: string, methodId: string, biota: string, rowId: string) => void;
  importRows: (projectId: string, areaId: string, serviceId: string, methodId: string, biota: string, newRows: Record<string, any>[]) => void;
  getServiceSubtotal: (projectId: string, areaId: string, serviceId: string, methodId: string, biota?: string) => number;
  getGrandTotalForArea: (
    projectId: string,
    areaId: string,
    activeServices: Record<EcosystemServiceId, boolean>,
    selectedMethods: Record<EcosystemServiceId, string>,
    biota?: string
  ) => number;
  rows: Record<string, any>[];
  getTotalEconomicValue: (projectId?: string) => number;
  getAllProjectRows: (projectId: string) => Record<string, any>[];
  retrySave: () => void;
  toggleOfflineSimulation: () => void;
  getCustomColumns: (projectId: string, areaId: string, serviceId: string, methodId: string, biota?: string) => CustomColumnDefinition[];
  addCustomColumn: (
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string | undefined,
    column: { label: string; type: CustomColumnType; required?: boolean }
  ) => void;
  updateCustomColumn: (
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string | undefined,
    columnId: string,
    updates: Partial<CustomColumnDefinition>
  ) => void;
  deleteCustomColumn: (
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string | undefined,
    columnId: string
  ) => void;
  addMultipleCustomColumns: (
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string | undefined,
    columns: { label: string; type?: CustomColumnType; required?: boolean }[]
  ) => void;
}

const STORAGE_KEY = 'pkspl_peneliti_multi_spreadsheet_store_v2';
const STORAGE_KEY_CUSTOM_COLS = 'pkspl_peneliti_custom_columns_v1';

const SpreadsheetContext = createContext<SpreadsheetContextType | undefined>(undefined);

export const SpreadsheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store format: key = `${projectId}_${areaId}_${serviceId}_${methodId}_${biota || 'none'}` -> rows: Record<string, any>[]
  const [store, setStore] = useState<Record<string, Record<string, any>[]>>(() => {
    return loadFromStorage<Record<string, Record<string, any>[]>>(STORAGE_KEY, {});
  });

  // Custom columns store format: key = `${projectId}_${areaId}_${serviceId}_${methodId}_${biota || 'none'}` -> CustomColumnDefinition[]
  const [customColumnsStore, setCustomColumnsStore] = useState<Record<string, CustomColumnDefinition[]>>(() => {
    return loadFromStorage<Record<string, CustomColumnDefinition[]>>(STORAGE_KEY_CUSTOM_COLS, {});
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedText, setLastSavedText] = useState<string>(() => `Tersimpan otomatis • ${formatTime()}`);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<boolean>(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Autosave trigger with debounce
  const triggerAutosave = useCallback((nextStore: Record<string, Record<string, any>[]>) => {
    setIsSaving(true);
    setSaveError(false);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (isOffline) {
        setIsSaving(false);
        setSaveError(true);
        return;
      }

      saveToStorage(STORAGE_KEY, nextStore);
      setIsSaving(false);
      setSaveError(false);
      setLastSavedText(`Tersimpan otomatis • ${formatTime()}`);
    }, 800);
  }, [isOffline]);

  const makeKey = (projectId: string, areaId: string, serviceId: string, methodId: string, biota?: string) => {
    return `${projectId}_${areaId}_${serviceId}_${methodId}_${biota || 'none'}`;
  };

  const getRows = useCallback((
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota?: string
  ): Record<string, any>[] => {
    const key = makeKey(projectId, areaId, serviceId, methodId, biota);
    if (store[key]) {
      return store[key];
    }
    // If not in store, retrieve initial rows from schema
    const schema = getMethodSchema(serviceId, methodId, biota);
    return schema.initialRows || [];
  }, [store]);

  const updateCell = useCallback((
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string = 'flora',
    rowId: string,
    field: string,
    value: any
  ) => {
    const key = makeKey(projectId, areaId, serviceId, methodId, biota);
    const schema = getMethodSchema(serviceId, methodId, biota);
    const currentRows = store[key] || schema.initialRows || [];

    const updatedRows = currentRows.map((r) => {
      if (r.id !== rowId) return r;

      const updatedRow = { ...r, [field]: value };
      // Run automatic recalculation from method schema
      const calc = schema.calculateRow(updatedRow);
      updatedRow.totalNilai = calc.total;
      if (calc.quantity !== undefined) {
        updatedRow.jumlah = calc.quantity;
      }

      return updatedRow;
    });

    const nextStore = { ...store, [key]: updatedRows };
    setStore(nextStore);
    triggerAutosave(nextStore);
  }, [store, triggerAutosave]);

  const addRow = useCallback((
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string = 'flora',
    areaHa: number = 79.86
  ) => {
    const key = makeKey(projectId, areaId, serviceId, methodId, biota);
    const schema = getMethodSchema(serviceId, methodId, biota);
    const currentRows = store[key] || schema.initialRows || [];

    const nextNo = currentRows.length + 1;
    const newRow = schema.defaultNewRow(nextNo, areaHa);

    const updatedRows = [...currentRows, newRow];
    const nextStore = { ...store, [key]: updatedRows };
    setStore(nextStore);
    triggerAutosave(nextStore);
  }, [store, triggerAutosave]);

  const deleteRow = useCallback((
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string = 'flora',
    rowId: string
  ) => {
    const key = makeKey(projectId, areaId, serviceId, methodId, biota);
    const schema = getMethodSchema(serviceId, methodId, biota);
    const currentRows = store[key] || schema.initialRows || [];

    const filtered = currentRows.filter(r => r.id !== rowId);
    const renumbered = filtered.map((r, idx) => ({ ...r, no: idx + 1 }));

    const nextStore = { ...store, [key]: renumbered };
    setStore(nextStore);
    triggerAutosave(nextStore);
  }, [store, triggerAutosave]);

  const importRows = useCallback((
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string = 'flora',
    newRows: Record<string, any>[]
  ) => {
    const key = makeKey(projectId, areaId, serviceId, methodId, biota);
    const schema = getMethodSchema(serviceId, methodId, biota);
    const currentRows = store[key] || schema.initialRows || [];

    const calculatedNewRows = newRows.map(r => {
      const calc = schema.calculateRow(r);
      return {
        ...r,
        totalNilai: r.totalNilai !== undefined && r.totalNilai !== null && !isNaN(Number(r.totalNilai)) ? Number(r.totalNilai) : calc.total,
        jumlah: r.jumlah !== undefined && r.jumlah !== null && !isNaN(Number(r.jumlah)) ? Number(r.jumlah) : calc.quantity
      };
    });

    const combined = [...currentRows, ...calculatedNewRows];
    const renumbered = combined.map((r, idx) => ({ ...r, no: idx + 1 }));

    const nextStore = { ...store, [key]: renumbered };
    setStore(nextStore);
    triggerAutosave(nextStore);
  }, [store, triggerAutosave]);

  const getServiceSubtotal = useCallback((
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string = 'flora'
  ): number => {
    const rows = getRows(projectId, areaId, serviceId, methodId, biota);
    const schema = getMethodSchema(serviceId, methodId, biota);
    return rows.reduce((acc, r) => {
      const val = (r.totalNilai !== undefined && r.totalNilai !== null && !isNaN(Number(r.totalNilai)) && Number(r.totalNilai) > 0)
        ? Number(r.totalNilai)
        : (schema.calculateRow(r).total || 0);
      return acc + val;
    }, 0);
  }, [getRows]);

  const getGrandTotalForArea = useCallback((
    projectId: string,
    areaId: string,
    activeServices?: Record<EcosystemServiceId, boolean>,
    selectedMethods?: Record<EcosystemServiceId, string>,
    biota: string = 'flora'
  ): number => {
    let grand = 0;
    const services: EcosystemServiceId[] = ['provisioning', 'regulating', 'supporting', 'cultural'];
    const act = activeServices || { provisioning: true, regulating: true, supporting: true, cultural: true };
    const meth = selectedMethods || ({} as Record<EcosystemServiceId, string>);

    services.forEach(sId => {
      if (act[sId]) {
        const mId = meth[sId] || (
          sId === 'provisioning' ? 'market-price' :
          sId === 'regulating' ? 'replacement-cost' :
          sId === 'supporting' ? 'nursery-ground' : 'tcm'
        );
        const sub = getServiceSubtotal(projectId, areaId, sId, mId, sId === 'provisioning' ? biota : undefined);
        grand += (sub || 0);
      }
    });

    return grand;
  }, [getServiceSubtotal]);

  // Convenience: fallback rows for active project or first area
  const rows = getRows('PRJ-2024-001', 'lc-01', 'provisioning', 'market-price', 'flora');

  const getAllProjectRows = useCallback((projectId: string): Record<string, any>[] => {
    const all: Record<string, any>[] = [];
    const prefix = `${projectId}_`;
    Object.keys(store).forEach(k => {
      if (k.startsWith(prefix)) {
        all.push(...store[k]);
      }
    });
    if (all.length === 0) {
      // Return defaults across services
      return [
        ...getRows(projectId, 'lc-01', 'provisioning', 'market-price', 'flora'),
        ...getRows(projectId, 'lc-01', 'regulating', 'replacement-cost'),
        ...getRows(projectId, 'lc-01', 'supporting', 'nursery-ground'),
        ...getRows(projectId, 'lc-01', 'cultural', 'tcm'),
      ];
    }
    return all;
  }, [store, getRows]);

  const getTotalEconomicValue = useCallback((projectId?: string): number => {
    const pid = projectId || 'PRJ-2024-001';
    const prov = getServiceSubtotal(pid, 'lc-01', 'provisioning', 'market-price', 'flora');
    const reg = getServiceSubtotal(pid, 'lc-01', 'regulating', 'replacement-cost');
    const supp = getServiceSubtotal(pid, 'lc-01', 'supporting', 'nursery-ground');
    const cult = getServiceSubtotal(pid, 'lc-01', 'cultural', 'tcm');
    return prov + reg + supp + cult;
  }, [getServiceSubtotal]);

  const triggerCustomColAutosave = useCallback((nextColsStore: Record<string, CustomColumnDefinition[]>) => {
    setIsSaving(true);
    setSaveError(false);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (isOffline) {
        setIsSaving(false);
        setSaveError(true);
        return;
      }

      saveToStorage(STORAGE_KEY_CUSTOM_COLS, nextColsStore);
      setIsSaving(false);
      setSaveError(false);
      setLastSavedText(`Tersimpan otomatis • ${formatTime()}`);
    }, 800);
  }, [isOffline]);

  const getCustomColumns = useCallback((
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota?: string
  ): CustomColumnDefinition[] => {
    const key = makeKey(projectId, areaId, serviceId, methodId, biota);
    return customColumnsStore[key] || [];
  }, [customColumnsStore]);

  const addCustomColumn = useCallback((
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string | undefined,
    column: { label: string; type: CustomColumnType; required?: boolean }
  ) => {
    const key = makeKey(projectId, areaId, serviceId, methodId, biota);
    const existing = customColumnsStore[key] || [];

    const rawKey = column.label.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    const uniqueKey = `c_${rawKey || 'col'}_${Date.now().toString(36)}`;

    const newCol: CustomColumnDefinition = {
      id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      key: uniqueKey,
      label: column.label,
      type: column.type,
      required: column.required ?? false,
      isCustom: true,
    };

    const nextCols = [...existing, newCol];
    const nextColsStore = { ...customColumnsStore, [key]: nextCols };
    setCustomColumnsStore(nextColsStore);
    saveToStorage(STORAGE_KEY_CUSTOM_COLS, nextColsStore);
    setLastSavedText(`Tersimpan otomatis • ${formatTime()}`);
  }, [customColumnsStore]);

  const updateCustomColumn = useCallback((
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string | undefined,
    columnId: string,
    updates: Partial<CustomColumnDefinition>
  ) => {
    const key = makeKey(projectId, areaId, serviceId, methodId, biota);
    const existing = customColumnsStore[key] || [];

    const nextCols = existing.map(c => {
      if (c.id !== columnId && c.key !== columnId) return c;
      return { ...c, ...updates };
    });

    const nextColsStore = { ...customColumnsStore, [key]: nextCols };
    setCustomColumnsStore(nextColsStore);
    saveToStorage(STORAGE_KEY_CUSTOM_COLS, nextColsStore);
    setLastSavedText(`Tersimpan otomatis • ${formatTime()}`);
  }, [customColumnsStore]);

  const deleteCustomColumn = useCallback((
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string | undefined,
    columnId: string
  ) => {
    const key = makeKey(projectId, areaId, serviceId, methodId, biota);
    const existing = customColumnsStore[key] || [];
    const target = existing.find(c => c.id === columnId || c.key === columnId);

    if (!target) return;

    // 1. Immediately delete from customColumnsStore and persistent storage
    const nextCols = existing.filter(c => c.id !== columnId && c.key !== columnId);
    const nextColsStore = { ...customColumnsStore, [key]: nextCols };
    setCustomColumnsStore(nextColsStore);
    saveToStorage(STORAGE_KEY_CUSTOM_COLS, nextColsStore);

    // 2. Immediately clean up cell values for this custom column across all rows in store
    const schema = getMethodSchema(serviceId, methodId, biota);
    const currentRows = store[key] || schema.initialRows || [];
    const targetKey = target.key;
    const updatedRows = currentRows.map(r => {
      const copy = { ...r };
      delete copy[targetKey];
      return copy;
    });

    const nextStore = { ...store, [key]: updatedRows };
    setStore(nextStore);
    saveToStorage(STORAGE_KEY, nextStore);
    setLastSavedText(`Tersimpan otomatis • ${formatTime()}`);
  }, [customColumnsStore, store]);

  const addMultipleCustomColumns = useCallback((
    projectId: string,
    areaId: string,
    serviceId: string,
    methodId: string,
    biota: string | undefined,
    newCols: { label: string; type?: CustomColumnType; required?: boolean }[]
  ) => {
    const key = makeKey(projectId, areaId, serviceId, methodId, biota);
    const existing = customColumnsStore[key] || [];

    const colsToAdd: CustomColumnDefinition[] = [];
    newCols.forEach((col, idx) => {
      const isDuplicate = existing.some(e => e.label.toLowerCase() === col.label.toLowerCase()) ||
                          colsToAdd.some(a => a.label.toLowerCase() === col.label.toLowerCase());
      if (!isDuplicate) {
        const rawKey = col.label.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
        const uniqueKey = `c_${rawKey || 'col'}_${Date.now().toString(36)}_${idx}`;
        colsToAdd.push({
          id: `col-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
          key: uniqueKey,
          label: col.label,
          type: col.type || 'text',
          required: col.required ?? false,
          isCustom: true,
        });
      }
    });

    if (colsToAdd.length > 0) {
      const nextColsStore = { ...customColumnsStore, [key]: [...existing, ...colsToAdd] };
      setCustomColumnsStore(nextColsStore);
      saveToStorage(STORAGE_KEY_CUSTOM_COLS, nextColsStore);
      setLastSavedText(`Tersimpan otomatis • ${formatTime()}`);
    }
  }, [customColumnsStore]);

  const retrySave = () => {
    triggerAutosave(store);
  };

  const toggleOfflineSimulation = () => {
    setIsOffline(prev => !prev);
  };

  return (
    <SpreadsheetContext.Provider
      value={{
        isSaving,
        lastSavedText,
        isOffline,
        saveError,
        rows,
        getRows,
        updateCell,
        addRow,
        deleteRow,
        importRows,
        getServiceSubtotal,
        getGrandTotalForArea,
        getTotalEconomicValue,
        getAllProjectRows,
        retrySave,
        toggleOfflineSimulation,
        getCustomColumns,
        addCustomColumn,
        updateCustomColumn,
        deleteCustomColumn,
        addMultipleCustomColumns,
      }}
    >
      {children}
    </SpreadsheetContext.Provider>
  );
};

export const useSpreadsheet = (): SpreadsheetContextType => {
  const ctx = useContext(SpreadsheetContext);
  if (!ctx) {
    throw new Error('useSpreadsheet must be used within a SpreadsheetProvider');
  }
  return ctx;
};
