import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectStatus } from '../types/project';
import { LandCoverPolygon, IndexItem, MapLayer } from '../types/spatial';
import { AnalystFeedback } from '../types/review';
import { INITIAL_PROJECTS } from '../mock/initialProjects';
import {
  INITIAL_LAND_COVERS,
  INITIAL_INDEX_LIST,
  INITIAL_MAP_LAYERS,
  JAKARTA_LAND_COVERS,
  JAKARTA_INDEX_LIST,
  JAKARTA_MAP_LAYERS,
  NUSA_PENIDA_LAND_COVERS,
  NUSA_PENIDA_INDEX_LIST,
  NUSA_PENIDA_MAP_LAYERS,
  generateMockPolygonsForProject,
  generateMockIndicesForProject
} from '../mock/spatialData';
import { INITIAL_ANALYST_FEEDBACK } from '../mock/analystReviewMock';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { generateProjectCode } from '../utils/formatter';

import { AreaServiceConfig, EcosystemServiceId } from '../types/valuation';

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  activeProjectId: string;
  landCovers: LandCoverPolygon[];
  indices: IndexItem[];
  layers: MapLayer[];
  analystFeedback: AnalystFeedback | null;
  areaConfigs: Record<string, AreaServiceConfig>;
  setActiveProjectId: (id: string) => void;
  createProject: (name: string, description: string) => Project;
  updateProjectStatus: (id: string, status: ProjectStatus) => void;
  addShpLayer: (name: string, featureCount: number, crs: string, targetProjId?: string) => void;
  setProjectHasShp: (projectId: string, hasShp: boolean) => void;
  getProjectLandCovers: (projectId: string) => LandCoverPolygon[];
  getProjectIndices: (projectId: string) => IndexItem[];
  getProjectLayers: (projectId: string) => MapLayer[];
  updateAreaConfig: (areaId: string, updates: Partial<AreaServiceConfig>) => void;
  getAreaConfig: (areaId: string) => AreaServiceConfig;
  createIndex: (item: Omit<IndexItem, 'id'>) => IndexItem;
  updateIndex: (id: string, updates: Partial<IndexItem>) => void;
  deleteIndex: (id: string) => void;
  linkPolygonToIndex: (polygonId: string, indexId: string) => void;
  unlinkPolygonFromIndex: (polygonId: string) => void;
  createIndexFromPolygon: (polygonId: string, customCode?: string) => IndexItem;
  simulateAnalystRejection: () => void;
  resolveFeedback: () => void;
  resetAllData: () => void;
}

const STORAGE_KEYS = {
  PROJECTS: 'pkspl_peneliti_projects_v1',
  ACTIVE_ID: 'pkspl_peneliti_active_id_v1',
  PROJECT_LAND_COVERS: 'pkspl_peneliti_proj_landcovers_v2',
  PROJECT_INDICES: 'pkspl_peneliti_proj_indices_v2',
  PROJECT_LAYERS: 'pkspl_peneliti_proj_layers_v2',
  FEEDBACK: 'pkspl_peneliti_feedback_v1',
  AREA_CONFIGS: 'pkspl_peneliti_area_configs_v1',
};

export const DEFAULT_AREA_CONFIG: AreaServiceConfig = {
  activeServices: {
    provisioning: true,
    regulating: true,
    supporting: true,
    cultural: true,
  },
  selectedMethods: {
    provisioning: 'market-price',
    regulating: 'replacement-cost',
    supporting: 'nursery-ground',
    cultural: 'tcm',
  },
  biota: 'flora',
};

const INITIAL_PROJECT_LAND_COVERS: Record<string, LandCoverPolygon[]> = {
  'PKS-994KY1': INITIAL_LAND_COVERS,
  'PKS-KKPRIV': [],
  'PKS-UW8J6F': NUSA_PENIDA_LAND_COVERS,
};

const INITIAL_PROJECT_INDICES: Record<string, IndexItem[]> = {
  'PKS-994KY1': INITIAL_INDEX_LIST,
  'PKS-KKPRIV': [],
  'PKS-UW8J6F': NUSA_PENIDA_INDEX_LIST,
};

const INITIAL_PROJECT_LAYERS: Record<string, MapLayer[]> = {
  'PKS-994KY1': INITIAL_MAP_LAYERS,
  'PKS-KKPRIV': [],
  'PKS-UW8J6F': NUSA_PENIDA_MAP_LAYERS,
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const loaded = loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return loaded.map(p => {
      const init = INITIAL_PROJECTS.find(i => i.id === p.id || i.code === p.code);
      return {
        ...p,
        hasShp: p.hasShp !== undefined ? p.hasShp : (init ? init.hasShp : false),
      };
    });
  });

  const [activeProjectId, setActiveProjectIdState] = useState<string>(() => 
    loadFromStorage<string>(STORAGE_KEYS.ACTIVE_ID, 'PKS-994KY1')
  );

  const [projectLandCovers, setProjectLandCovers] = useState<Record<string, LandCoverPolygon[]>>(() => {
    const loaded = loadFromStorage<Record<string, LandCoverPolygon[]>>(STORAGE_KEYS.PROJECT_LAND_COVERS, INITIAL_PROJECT_LAND_COVERS);
    return {
      ...INITIAL_PROJECT_LAND_COVERS,
      ...loaded,
    };
  });

  const [projectIndices, setProjectIndices] = useState<Record<string, IndexItem[]>>(() => {
    const loaded = loadFromStorage<Record<string, IndexItem[]>>(STORAGE_KEYS.PROJECT_INDICES, INITIAL_PROJECT_INDICES);
    return {
      ...INITIAL_PROJECT_INDICES,
      ...loaded,
    };
  });

  const [projectLayers, setProjectLayers] = useState<Record<string, MapLayer[]>>(() => {
    const loaded = loadFromStorage<Record<string, MapLayer[]>>(STORAGE_KEYS.PROJECT_LAYERS, INITIAL_PROJECT_LAYERS);
    return {
      ...INITIAL_PROJECT_LAYERS,
      ...loaded,
    };
  });

  const [analystFeedback, setAnalystFeedback] = useState<AnalystFeedback | null>(() => 
    loadFromStorage<AnalystFeedback | null>(STORAGE_KEYS.FEEDBACK, INITIAL_ANALYST_FEEDBACK)
  );

  const [areaConfigs, setAreaConfigs] = useState<Record<string, AreaServiceConfig>>(() => 
    loadFromStorage<Record<string, AreaServiceConfig>>(STORAGE_KEYS.AREA_CONFIGS, {
      'poly-1': DEFAULT_AREA_CONFIG,
      'poly-2': DEFAULT_AREA_CONFIG,
      'poly-3': DEFAULT_AREA_CONFIG,
      'poly-4': DEFAULT_AREA_CONFIG,
      'poly-5': DEFAULT_AREA_CONFIG,
    })
  );

  // Sync to storage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  }, [projects]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVE_ID, activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECT_LAND_COVERS, projectLandCovers);
  }, [projectLandCovers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECT_INDICES, projectIndices);
  }, [projectIndices]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECT_LAYERS, projectLayers);
  }, [projectLayers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FEEDBACK, analystFeedback);
  }, [analystFeedback]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.AREA_CONFIGS, areaConfigs);
  }, [areaConfigs]);

  const activeProject = projects.find(p => p.id === activeProjectId || p.code === activeProjectId) || projects[0] || null;

  const setActiveProjectId = (id: string) => {
    setActiveProjectIdState(id);
  };

  const getProjectLandCovers = (projectId: string): LandCoverPolygon[] => {
    return projectLandCovers[projectId] || [];
  };

  const getProjectIndices = (projectId: string): IndexItem[] => {
    return projectIndices[projectId] || [];
  };

  const getProjectLayers = (projectId: string): MapLayer[] => {
    return projectLayers[projectId] || [];
  };

  const landCovers = projectLandCovers[activeProjectId] || [];
  const indices = projectIndices[activeProjectId] || [];
  const layers = projectLayers[activeProjectId] || [];

  const getAreaConfig = (areaId: string): AreaServiceConfig => {
    const found = areaConfigs[areaId];
    if (!found) return DEFAULT_AREA_CONFIG;
    return {
      ...DEFAULT_AREA_CONFIG,
      ...found,
      activeServices: {
        ...DEFAULT_AREA_CONFIG.activeServices,
        ...(found.activeServices || {})
      },
      selectedMethods: {
        ...DEFAULT_AREA_CONFIG.selectedMethods,
        ...(found.selectedMethods || {})
      }
    };
  };

  const updateAreaConfig = (areaId: string, updates: Partial<AreaServiceConfig>) => {
    setAreaConfigs(prev => {
      const current = prev[areaId] || DEFAULT_AREA_CONFIG;
      const next = {
        ...current,
        ...updates,
        activeServices: updates.activeServices ? { ...current.activeServices, ...updates.activeServices } : current.activeServices,
        selectedMethods: updates.selectedMethods ? { ...current.selectedMethods, ...updates.selectedMethods } : current.selectedMethods,
      };
      return { ...prev, [areaId]: next };
    });
  };

  const createProject = (name: string, description: string): Project => {
    const code = generateProjectCode();
    const newProj: Project = {
      id: code,
      code,
      name,
      description,
      status: 'DRAFT',
      lead: 'Peneliti Utama (Saya)',
      location: 'Kabupaten Badung, Bali',
      ecosystem: 'Kawasan Pesisir & Mangrove',
      year: new Date().getFullYear(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: 'Baru saja',
      hasShp: false,
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    setActiveProjectIdState(newProj.id);
    setProjectLandCovers(prev => ({ ...prev, [code]: [] }));
    setProjectIndices(prev => ({ ...prev, [code]: [] }));
    setProjectLayers(prev => ({ ...prev, [code]: [] }));
    return newProj;
  };

  const updateProjectStatus = (id: string, status: ProjectStatus) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id || p.code === id) {
        return {
          ...p,
          status,
          updatedAt: 'Baru saja',
          submittedAt: status === 'MENUNGGU_ANALYST' ? new Date().toISOString().split('T')[0] : p.submittedAt
        };
      }
      return p;
    }));
  };

  const addShpLayer = (name: string, featureCount: number, crs: string, targetProjId?: string) => {
    const projId = targetProjId || activeProjectId;

    let mockPolys: LandCoverPolygon[] = [];
    let mockIdxs: IndexItem[] = [];
    let mockLyrs: MapLayer[] = [];

    if (projId === 'PKS-KKPRIV') {
      mockPolys = JAKARTA_LAND_COVERS;
      mockIdxs = JAKARTA_INDEX_LIST;
      mockLyrs = JAKARTA_MAP_LAYERS;
    } else if (projId === 'PKS-UW8J6F') {
      mockPolys = NUSA_PENIDA_LAND_COVERS;
      mockIdxs = NUSA_PENIDA_INDEX_LIST;
      mockLyrs = NUSA_PENIDA_MAP_LAYERS;
    } else if (projId === 'PKS-994KY1') {
      mockPolys = INITIAL_LAND_COVERS;
      mockIdxs = INITIAL_INDEX_LIST;
      mockLyrs = INITIAL_MAP_LAYERS;
    } else {
      mockPolys = generateMockPolygonsForProject(projId);
      mockIdxs = generateMockIndicesForProject(projId, mockPolys);
      mockLyrs = [
        {
          id: `layer-${Date.now()}`,
          projectId: projId,
          name: name || 'Batas Administrasi & Tutupan Lahan',
          type: 'polygon',
          featureCount: featureCount || mockPolys.length,
          crs: crs || 'WGS 84 / UTM Zone 50S (EPSG:32750)',
          color: '#0ea5e9',
          visible: true,
          updatedAt: new Date().toISOString().split('T')[0]
        }
      ];
    }

    setProjectLayers(prev => ({
      ...prev,
      [projId]: mockLyrs
    }));

    setProjectLandCovers(prev => ({
      ...prev,
      [projId]: mockPolys
    }));

    setProjectIndices(prev => ({
      ...prev,
      [projId]: mockIdxs
    }));

    // Set hasShp to true ONLY on the targeted project
    setProjects(prev => prev.map(p => {
      if (p.id === projId || p.code === projId) {
        return { ...p, hasShp: true, updatedAt: 'Baru saja' };
      }
      return p;
    }));
  };

  const setProjectHasShp = (projectId: string, hasShp: boolean) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId || p.code === projectId) {
        return { ...p, hasShp, updatedAt: 'Baru saja' };
      }
      return p;
    }));
  };

  const createIndex = (item: Omit<IndexItem, 'id'>): IndexItem => {
    const newId = `idx-${Date.now()}`;
    const newItem: IndexItem = {
      ...item,
      id: newId,
      status: item.status || 'Draft',
      spatialStatus: item.polygonId ? 'connected' : 'unconnected',
      unit: item.unit || 'ha',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProjectIndices(prev => ({
      ...prev,
      [activeProjectId]: [newItem, ...(prev[activeProjectId] || [])]
    }));

    // If linked to polygon, update polygon too
    if (newItem.polygonId) {
      setProjectLandCovers(prev => ({
        ...prev,
        [activeProjectId]: (prev[activeProjectId] || []).map(p => {
          if (p.id === newItem.polygonId) {
            return {
              ...p,
              indexId: newItem.id,
              indexCode: newItem.code,
              indexName: newItem.name
            };
          }
          return p;
        })
      }));
    }

    return newItem;
  };

  const updateIndex = (id: string, updates: Partial<IndexItem>) => {
    setProjectIndices(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).map(item => {
        if (item.id === id) {
          return { ...item, ...updates, updatedAt: 'Baru saja' };
        }
        return item;
      })
    }));
  };

  const deleteIndex = (id: string) => {
    setProjectIndices(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).filter(i => i.id !== id)
    }));
    // Unlink any polygon attached to this index
    setProjectLandCovers(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).map(p => {
        if (p.indexId === id) {
          return {
            ...p,
            indexId: undefined,
            indexCode: undefined,
            indexName: undefined
          };
        }
        return p;
      })
    }));
  };

  const linkPolygonToIndex = (polygonId: string, indexId: string) => {
    const currentIndices = projectIndices[activeProjectId] || [];
    const targetIndex = currentIndices.find(i => i.id === indexId);
    if (!targetIndex) return;

    setProjectLandCovers(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).map(p => {
        if (p.id === polygonId) {
          return {
            ...p,
            indexId: targetIndex.id,
            indexCode: targetIndex.code,
            indexName: targetIndex.name
          };
        }
        return p;
      })
    }));

    setProjectIndices(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).map(i => {
        if (i.id === indexId) {
          return {
            ...i,
            spatialStatus: 'connected',
            polygonId: polygonId,
            landCoverId: polygonId,
            updatedAt: 'Baru saja'
          };
        }
        return i;
      })
    }));
  };

  const unlinkPolygonFromIndex = (polygonId: string) => {
    setProjectLandCovers(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).map(p => {
        if (p.id === polygonId) {
          const oldIndexId = p.indexId;
          if (oldIndexId) {
            setProjectIndices(idxList => ({
              ...idxList,
              [activeProjectId]: (idxList[activeProjectId] || []).map(i => {
                if (i.id === oldIndexId) {
                  return {
                    ...i,
                    spatialStatus: 'unconnected',
                    polygonId: undefined,
                    landCoverId: undefined
                  };
                }
                return i;
              })
            }));
          }
          return {
            ...p,
            indexId: undefined,
            indexCode: undefined,
            indexName: undefined
          };
        }
        return p;
      })
    }));
  };

  const createIndexFromPolygon = (polygonId: string, customCode?: string): IndexItem => {
    const activePolys = projectLandCovers[activeProjectId] || [];
    const activeIdxs = projectIndices[activeProjectId] || [];
    const poly = activePolys.find(p => p.id === polygonId);
    const code = customCode || `IDX-${String(activeIdxs.length + 1).padStart(3, '0')}`;
    const name = poly ? poly.name : `Index ${code}`;
    const type = poly ? (poly.type.charAt(0).toUpperCase() + poly.type.slice(1)) : 'Mangrove';
    const areaHa = poly ? poly.areaHa : 50;

    return createIndex({
      code,
      name,
      landCoverType: type,
      landCoverName: name,
      landCoverId: polygonId,
      polygonId: polygonId,
      areaHa,
      unit: 'ha',
      description: `Index dibuat otomatis dari polygon area spasial ${name}.`,
      status: 'Draft',
      spatialStatus: 'connected',
    });
  };

  const toggleLayerVisibility = (layerId: string) => {
    setProjectLayers(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).map(l => l.id === layerId ? { ...l, visible: !l.visible } : l)
    }));
  };

  const simulateAnalystRejection = () => {
    updateProjectStatus(activeProjectId, 'PERLU_PERBAIKAN');
    setAnalystFeedback({
      ...INITIAL_ANALYST_FEEDBACK,
      projectId: activeProjectId,
      timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    });
  };

  const resolveFeedback = () => {
    setAnalystFeedback(null);
    updateProjectStatus(activeProjectId, 'SIAP_REVIEW');
  };

  const resetAllData = () => {
    setProjects(INITIAL_PROJECTS);
    setActiveProjectIdState('PKS-994KY1');
    setProjectLandCovers(INITIAL_PROJECT_LAND_COVERS);
    setProjectIndices(INITIAL_PROJECT_INDICES);
    setProjectLayers(INITIAL_PROJECT_LAYERS);
    setAnalystFeedback(INITIAL_ANALYST_FEEDBACK);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        activeProjectId,
        landCovers,
        indices,
        layers,
        analystFeedback,
        areaConfigs,
        setActiveProjectId,
        createProject,
        updateProjectStatus,
        addShpLayer,
        setProjectHasShp,
        getProjectLandCovers,
        getProjectIndices,
        getProjectLayers,
        toggleLayerVisibility,
        updateAreaConfig,
        getAreaConfig,
        createIndex,
        updateIndex,
        deleteIndex,
        linkPolygonToIndex,
        unlinkPolygonFromIndex,
        createIndexFromPolygon,
        simulateAnalystRejection,
        resolveFeedback,
        resetAllData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return ctx;
};
