import { LandCoverPolygon, IndexItem, MapLayer } from '../types/spatial';

export const INITIAL_LAND_COVERS: LandCoverPolygon[] = [
  {
    id: 'poly-1',
    code: 'TL-MG-01',
    name: 'Mangrove Barat',
    type: 'mangrove',
    areaHa: 79.86,
    // Real coordinates around Benoa Bay West mangrove strip
    center: [-8.745, 115.205],
    coordinates: [
      [-8.738, 115.198],
      [-8.735, 115.210],
      [-8.745, 115.215],
      [-8.756, 115.210],
      [-8.754, 115.199],
      [-8.745, 115.195]
    ],
    indexId: 'idx-1',
    indexCode: 'IDX-001',
    indexName: 'Mangrove Barat',
    activeServices: ['provisioning', 'regulating', 'supporting'],
    serviceDetails: [
      {
        serviceId: 'provisioning',
        methodName: 'Market Price',
        value: 19920297915,
        status: 'verified'
      },
      {
        serviceId: 'regulating',
        methodName: 'Replacement Cost',
        value: 2357865750,
        status: 'verified'
      },
      {
        serviceId: 'supporting',
        methodName: 'Nursery Ground',
        value: 1521514120,
        status: 'verified'
      }
    ],
    totalValue: 23799677785
  },
  {
    id: 'poly-2',
    code: 'TL-MG-02',
    name: 'Mangrove Timur',
    type: 'mangrove',
    areaHa: 62.40,
    center: [-8.748, 115.228],
    coordinates: [
      [-8.740, 115.222],
      [-8.738, 115.234],
      [-8.752, 115.238],
      [-8.758, 115.228],
      [-8.750, 115.220]
    ],
    indexId: undefined,
    indexCode: undefined,
    indexName: undefined,
    activeServices: ['provisioning', 'regulating'],
    serviceDetails: [
      {
        serviceId: 'provisioning',
        methodName: 'Market Price',
        value: 14200000000,
        status: 'verified'
      },
      {
        serviceId: 'regulating',
        methodName: 'Carbon Storage',
        value: 1850000000,
        status: 'verified'
      }
    ],
    totalValue: 16050000000
  },
  {
    id: 'poly-3',
    code: 'TL-LM-01',
    name: 'Lamun Utara',
    type: 'lamun',
    areaHa: 34.20,
    center: [-8.732, 115.220],
    coordinates: [
      [-8.728, 115.212],
      [-8.725, 115.225],
      [-8.735, 115.228],
      [-8.738, 115.215]
    ],
    indexId: 'idx-3',
    indexCode: 'IDX-003',
    indexName: 'Lamun Utara',
    activeServices: ['regulating', 'supporting'],
    serviceDetails: [
      {
        serviceId: 'regulating',
        methodName: 'Carbon Storage',
        value: 1200000000,
        status: 'verified'
      },
      {
        serviceId: 'supporting',
        methodName: 'Habitat Function',
        value: 750000000,
        status: 'verified'
      }
    ],
    totalValue: 1950000000
  },
  {
    id: 'poly-4',
    code: 'TL-TK-01',
    name: 'Terumbu Karang Selatan',
    type: 'terumbu_karang',
    areaHa: 18.75,
    center: [-8.762, 115.215],
    coordinates: [
      [-8.758, 115.210],
      [-8.755, 115.222],
      [-8.768, 115.225],
      [-8.770, 115.212]
    ],
    indexId: undefined,
    indexCode: undefined,
    indexName: undefined,
    activeServices: ['cultural', 'supporting'],
    serviceDetails: [
      {
        serviceId: 'cultural',
        methodName: 'Travel Cost Method (TCM)',
        value: 1127000000,
        status: 'draft'
      },
      {
        serviceId: 'supporting',
        methodName: 'Biodiversity Support',
        value: 860000000,
        status: 'draft'
      }
    ],
    totalValue: 1987000000
  },
  {
    id: 'poly-5',
    code: 'TL-PR-01',
    name: 'Perairan Teluk',
    type: 'perairan',
    areaHa: 120.50,
    center: [-8.742, 115.218],
    coordinates: [
      [-8.735, 115.210],
      [-8.736, 115.225],
      [-8.748, 115.228],
      [-8.750, 115.215]
    ],
    indexId: 'idx-5',
    indexCode: 'IDX-005',
    indexName: 'Laguna Perairan Benoa',
    activeServices: ['provisioning'],
    serviceDetails: [
      {
        serviceId: 'provisioning',
        methodName: 'Effect on Production',
        value: 4100000000,
        status: 'verified'
      }
    ],
    totalValue: 4100000000
  }
];

export const INITIAL_INDEX_LIST: IndexItem[] = [
  {
    id: 'idx-1',
    code: 'IDX-001',
    name: 'Mangrove Barat',
    landCoverType: 'Mangrove',
    landCoverName: 'Mangrove Barat',
    landCoverId: 'poly-1',
    areaHa: 79.86,
    unit: 'ha',
    description: 'Hamparan mangrove padat bagian barat teluk dengan kerapatan tinggi.',
    status: 'Draft',
    spatialStatus: 'connected',
    polygonId: 'poly-1',
    createdAt: '2025-08-20'
  },
  {
    id: 'idx-2',
    code: 'IDX-002',
    name: 'Mangrove Timur',
    landCoverType: 'Mangrove',
    landCoverName: 'Mangrove Timur',
    landCoverId: 'poly-2',
    areaHa: 62.40,
    unit: 'ha',
    description: 'Sabuk mangrove sisi timur berbatasan dengan kanal pelabuhan Benoa.',
    status: 'Draft',
    spatialStatus: 'unconnected',
    createdAt: '2025-08-22'
  },
  {
    id: 'idx-3',
    code: 'IDX-003',
    name: 'Lamun Utara',
    landCoverType: 'Lamun',
    landCoverName: 'Lamun Utara',
    landCoverId: 'poly-3',
    areaHa: 34.20,
    unit: 'ha',
    description: 'Padang lamun perairan dangkal subur tempat makan biota laut.',
    status: 'Selesai',
    spatialStatus: 'connected',
    polygonId: 'poly-3',
    createdAt: '2025-08-21'
  },
  {
    id: 'idx-5',
    code: 'IDX-005',
    name: 'Laguna Perairan Benoa',
    landCoverType: 'Perairan',
    landCoverName: 'Perairan Teluk',
    landCoverId: 'poly-5',
    areaHa: 120.50,
    unit: 'ha',
    description: 'Badan air estuari yang menampung muara sungai aliran Badung.',
    status: 'Selesai',
    spatialStatus: 'connected',
    polygonId: 'poly-5',
    createdAt: '2025-08-19'
  }
];

export const INITIAL_MAP_LAYERS: MapLayer[] = [
  {
    id: 'layer-1',
    projectId: 'PKS-994KY1',
    name: 'Batas Proyek',
    type: 'polygon',
    featureCount: 1,
    crs: 'EPSG:4326 (WGS 84)',
    color: '#3b82f6',
    visible: true,
    updatedAt: '2025-08-20'
  },
  {
    id: 'layer-2',
    projectId: 'PKS-994KY1',
    name: 'Area Tutupan Lahan',
    type: 'polygon',
    featureCount: 5,
    crs: 'EPSG:4326 (WGS 84)',
    color: '#10b981',
    visible: true,
    updatedAt: '2025-08-22'
  },
  {
    id: 'layer-3',
    projectId: 'PKS-994KY1',
    name: 'Index Poligon',
    type: 'polygon',
    featureCount: 5,
    crs: 'EPSG:4326 (WGS 84)',
    color: '#8b5cf6',
    visible: true,
    updatedAt: '2025-08-22'
  },
  {
    id: 'layer-4',
    projectId: 'PKS-994KY1',
    name: 'Batas Administrasi',
    type: 'line',
    featureCount: 4,
    crs: 'EPSG:4326 (WGS 84)',
    color: '#64748b',
    visible: false,
    updatedAt: '2025-08-15'
  },
  {
    id: 'layer-5',
    projectId: 'PKS-994KY1',
    name: 'Jaringan Jalan',
    type: 'line',
    featureCount: 12,
    crs: 'EPSG:4326 (WGS 84)',
    color: '#f59e0b',
    visible: false,
    updatedAt: '2025-08-15'
  },
  {
    id: 'layer-6',
    projectId: 'PKS-994KY1',
    name: 'Sungai & Muara',
    type: 'line',
    featureCount: 6,
    crs: 'EPSG:4326 (WGS 84)',
    color: '#06b6d4',
    visible: false,
    updatedAt: '2025-08-15'
  }
];

// -------------------------------------------------------------
// PROJECT B: PKS-KKPRIV (Kajian Hutan Kota Jakarta)
// Loaded when user performs simulated upload SHP for Project B
// -------------------------------------------------------------
export const JAKARTA_LAND_COVERS: LandCoverPolygon[] = [
  {
    id: 'poly-jkt-1',
    code: 'TL-HK-01',
    name: 'Hutan Kota Srengseng',
    type: 'mangrove',
    areaHa: 15.30,
    center: [-6.195, 106.765],
    coordinates: [
      [-6.191, 106.761],
      [-6.190, 106.770],
      [-6.199, 106.772],
      [-6.202, 106.762]
    ],
    indexId: 'idx-jkt-1',
    indexCode: 'IDX-JKT-01',
    indexName: 'Hutan Kota Srengseng',
    activeServices: ['regulating', 'cultural'],
    serviceDetails: [
      { serviceId: 'regulating', methodName: 'Carbon Sequestration', value: 2100000000, status: 'verified' },
      { serviceId: 'cultural', methodName: 'Recreation Value', value: 1350000000, status: 'verified' }
    ],
    totalValue: 3450000000
  },
  {
    id: 'poly-jkt-2',
    code: 'TL-HK-02',
    name: 'Tebet Eco Park & Buffer Wetland',
    type: 'perairan',
    areaHa: 7.30,
    center: [-6.238, 106.852],
    coordinates: [
      [-6.234, 106.848],
      [-6.233, 106.856],
      [-6.242, 106.857],
      [-6.243, 106.849]
    ],
    indexId: 'idx-jkt-2',
    indexCode: 'IDX-JKT-02',
    indexName: 'Tebet Eco Park',
    activeServices: ['regulating', 'cultural'],
    serviceDetails: [
      { serviceId: 'regulating', methodName: 'Flood Mitigation', value: 1200000000, status: 'verified' },
      { serviceId: 'cultural', methodName: 'Recreation Value', value: 650000000, status: 'verified' }
    ],
    totalValue: 1850000000
  },
  {
    id: 'poly-jkt-3',
    code: 'TL-HK-03',
    name: 'Hutan Kota Kemayoran',
    type: 'mangrove',
    areaHa: 22.50,
    center: [-6.148, 106.845],
    coordinates: [
      [-6.142, 106.840],
      [-6.140, 106.852],
      [-6.155, 106.854],
      [-6.156, 106.841]
    ],
    indexId: 'idx-jkt-3',
    indexCode: 'IDX-JKT-03',
    indexName: 'Hutan Kota Kemayoran',
    activeServices: ['regulating', 'supporting'],
    serviceDetails: [
      { serviceId: 'regulating', methodName: 'Air Quality Regulation', value: 3100000000, status: 'verified' },
      { serviceId: 'supporting', methodName: 'Urban Biodiversity', value: 1850000000, status: 'verified' }
    ],
    totalValue: 4950000000
  }
];

export const JAKARTA_INDEX_LIST: IndexItem[] = [
  {
    id: 'idx-jkt-1',
    code: 'IDX-JKT-01',
    name: 'Hutan Kota Srengseng',
    landCoverType: 'Hutan Kota',
    landCoverName: 'Hutan Kota Srengseng',
    landCoverId: 'poly-jkt-1',
    areaHa: 15.30,
    unit: 'ha',
    description: 'Kawasan konservasi vegetasi dataran rendah perkotaan Jakarta Barat.',
    status: 'Selesai',
    spatialStatus: 'connected',
    polygonId: 'poly-jkt-1',
    createdAt: '2025-09-01'
  },
  {
    id: 'idx-jkt-2',
    code: 'IDX-JKT-02',
    name: 'Tebet Eco Park',
    landCoverType: 'Urban Wetland',
    landCoverName: 'Tebet Eco Park & Buffer Wetland',
    landCoverId: 'poly-jkt-2',
    areaHa: 7.30,
    unit: 'ha',
    description: 'Taman ekologi kota dengan retensi air dan zona riparian.',
    status: 'Selesai',
    spatialStatus: 'connected',
    polygonId: 'poly-jkt-2',
    createdAt: '2025-09-01'
  },
  {
    id: 'idx-jkt-3',
    code: 'IDX-JKT-03',
    name: 'Hutan Kota Kemayoran',
    landCoverType: 'Hutan Kota',
    landCoverName: 'Hutan Kota Kemayoran',
    landCoverId: 'poly-jkt-3',
    areaHa: 22.50,
    unit: 'ha',
    description: 'Kawasan terbuka hijau alami dengan habitat burung perkotaan.',
    status: 'Draft',
    spatialStatus: 'connected',
    polygonId: 'poly-jkt-3',
    createdAt: '2025-09-02'
  }
];

export const JAKARTA_MAP_LAYERS: MapLayer[] = [
  {
    id: 'layer-jkt-1',
    projectId: 'PKS-KKPRIV',
    name: 'Batas Kawasan Hutan Kota DKI',
    type: 'polygon',
    featureCount: 1,
    crs: 'EPSG:4326 (WGS 84)',
    color: '#3b82f6',
    visible: true,
    updatedAt: '2025-09-01'
  },
  {
    id: 'layer-jkt-2',
    projectId: 'PKS-KKPRIV',
    name: 'Area Tutupan Hutan Kota & Wetland',
    type: 'polygon',
    featureCount: 3,
    crs: 'EPSG:4326 (WGS 84)',
    color: '#10b981',
    visible: true,
    updatedAt: '2025-09-02'
  }
];

// -------------------------------------------------------------
// PROJECT C: PKS-UW8J6F (Pemantauan Terumbu Karang Bali)
// -------------------------------------------------------------
export const NUSA_PENIDA_LAND_COVERS: LandCoverPolygon[] = [
  {
    id: 'poly-np-1',
    code: 'TL-TK-NP1',
    name: 'Terumbu Karang Crystal Bay',
    type: 'terumbu_karang',
    areaHa: 24.80,
    center: [-8.715, 115.460],
    coordinates: [
      [-8.710, 115.452],
      [-8.708, 115.468],
      [-8.722, 115.470],
      [-8.725, 115.455]
    ],
    indexId: 'idx-np-1',
    indexCode: 'IDX-NP-01',
    indexName: 'Terumbu Karang Crystal Bay',
    activeServices: ['provisioning', 'cultural', 'supporting'],
    serviceDetails: [
      { serviceId: 'provisioning', methodName: 'Fisheries Production', value: 3400000000, status: 'verified' },
      { serviceId: 'cultural', methodName: 'Diving Tourism (TCM)', value: 5120000000, status: 'verified' }
    ],
    totalValue: 8520000000
  },
  {
    id: 'poly-np-2',
    code: 'TL-TK-NP2',
    name: 'Terumbu Karang Manta Point',
    type: 'terumbu_karang',
    areaHa: 45.20,
    center: [-8.788, 115.525],
    coordinates: [
      [-8.780, 115.518],
      [-8.778, 115.535],
      [-8.795, 115.538],
      [-8.798, 115.520]
    ],
    indexId: 'idx-np-2',
    indexCode: 'IDX-NP-02',
    indexName: 'Terumbu Karang Manta Point',
    activeServices: ['cultural', 'supporting'],
    serviceDetails: [
      { serviceId: 'cultural', methodName: 'Marine Ecotourism', value: 8200000000, status: 'verified' },
      { serviceId: 'supporting', methodName: 'Manta Ray Sanctuary', value: 4200000000, status: 'verified' }
    ],
    totalValue: 12400000000
  },
  {
    id: 'poly-np-3',
    code: 'TL-LM-NP1',
    name: 'Padang Lamun Nusa Lembongan',
    type: 'lamun',
    areaHa: 18.60,
    center: [-8.685, 115.445],
    coordinates: [
      [-8.680, 115.438],
      [-8.678, 115.452],
      [-8.692, 115.455],
      [-8.695, 115.440]
    ],
    indexId: 'idx-np-3',
    indexCode: 'IDX-NP-03',
    indexName: 'Padang Lamun Lembongan',
    activeServices: ['regulating', 'supporting'],
    serviceDetails: [
      { serviceId: 'regulating', methodName: 'Blue Carbon', value: 1650000000, status: 'verified' },
      { serviceId: 'supporting', methodName: 'Nursery Habitat', value: 1450000000, status: 'verified' }
    ],
    totalValue: 3100000000
  }
];

export const NUSA_PENIDA_INDEX_LIST: IndexItem[] = [
  {
    id: 'idx-np-1',
    code: 'IDX-NP-01',
    name: 'Terumbu Karang Crystal Bay',
    landCoverType: 'Terumbu Karang',
    landCoverName: 'Terumbu Karang Crystal Bay',
    landCoverId: 'poly-np-1',
    areaHa: 24.80,
    unit: 'ha',
    description: 'Zona inti terumbu karang karang tepi perairan barat Nusa Penida.',
    status: 'Selesai',
    spatialStatus: 'connected',
    polygonId: 'poly-np-1',
    createdAt: '2024-11-20'
  },
  {
    id: 'idx-np-2',
    code: 'IDX-NP-02',
    name: 'Terumbu Karang Manta Point',
    landCoverType: 'Terumbu Karang',
    landCoverName: 'Terumbu Karang Manta Point',
    landCoverId: 'poly-np-2',
    areaHa: 45.20,
    unit: 'ha',
    description: 'Kawasan terumbu tebing curam habitat pari manta.',
    status: 'Selesai',
    spatialStatus: 'connected',
    polygonId: 'poly-np-2',
    createdAt: '2024-11-21'
  },
  {
    id: 'idx-np-3',
    code: 'IDX-NP-03',
    name: 'Padang Lamun Lembongan',
    landCoverType: 'Lamun',
    landCoverName: 'Padang Lamun Nusa Lembongan',
    landCoverId: 'poly-np-3',
    areaHa: 18.60,
    unit: 'ha',
    description: 'Ekosistem lamun padat perairan dangkal selat Ceningan-Lembongan.',
    status: 'Draft',
    spatialStatus: 'connected',
    polygonId: 'poly-np-3',
    createdAt: '2024-11-22'
  }
];

export const NUSA_PENIDA_MAP_LAYERS: MapLayer[] = [
  {
    id: 'layer-np-1',
    projectId: 'PKS-UW8J6F',
    name: 'KKP Nusa Penida (Zonasi Inti)',
    type: 'polygon',
    featureCount: 1,
    crs: 'EPSG:4326 (WGS 84)',
    color: '#0284c7',
    visible: true,
    updatedAt: '2024-11-20'
  },
  {
    id: 'layer-np-2',
    projectId: 'PKS-UW8J6F',
    name: 'Tutupan Karang & Lamun Nusa Penida',
    type: 'polygon',
    featureCount: 3,
    crs: 'EPSG:4326 (WGS 84)',
    color: '#f97316',
    visible: true,
    updatedAt: '2024-11-22'
  }
];

// Dynamic generator for newly created user projects
export const generateMockPolygonsForProject = (projId: string, layerName?: string): LandCoverPolygon[] => {
  return [
    {
      id: `poly-${projId}-1`,
      code: 'TL-Z1-01',
      name: `Zona Inti ${layerName || 'Kawasan Spasial'}`,
      type: 'mangrove',
      areaHa: 42.50,
      center: [-8.740, 115.210],
      coordinates: [
        [-8.735, 115.205],
        [-8.733, 115.218],
        [-8.745, 115.220],
        [-8.748, 115.208]
      ],
      indexId: `idx-${projId}-1`,
      indexCode: 'IDX-001',
      indexName: 'Zona Inti Konservasi',
      activeServices: ['provisioning', 'regulating'],
      serviceDetails: [
        { serviceId: 'provisioning', methodName: 'Market Price', value: 4500000000, status: 'verified' }
      ],
      totalValue: 4500000000
    },
    {
      id: `poly-${projId}-2`,
      code: 'TL-Z2-02',
      name: 'Zona Pemanfaatan Terbatas',
      type: 'lamun',
      areaHa: 28.30,
      center: [-8.750, 115.225],
      coordinates: [
        [-8.745, 115.220],
        [-8.743, 115.232],
        [-8.758, 115.235],
        [-8.760, 115.222]
      ],
      indexId: `idx-${projId}-2`,
      indexCode: 'IDX-002',
      indexName: 'Zona Pemanfaatan Terbatas',
      activeServices: ['cultural', 'supporting'],
      serviceDetails: [
        { serviceId: 'cultural', methodName: 'Travel Cost Method', value: 2100000000, status: 'draft' }
      ],
      totalValue: 2100000000
    }
  ];
};

export const generateMockIndicesForProject = (projId: string): IndexItem[] => {
  return [
    {
      id: `idx-${projId}-1`,
      code: 'IDX-001',
      name: 'Zona Inti Konservasi',
      landCoverType: 'Mangrove',
      landCoverName: 'Zona Inti Kawasan Spasial',
      landCoverId: `poly-${projId}-1`,
      areaHa: 42.50,
      unit: 'ha',
      description: 'Zona inti perlindungan habitat utama.',
      status: 'Selesai',
      spatialStatus: 'connected',
      polygonId: `poly-${projId}-1`,
      createdAt: new Date().toISOString().split('T')[0]
    },
    {
      id: `idx-${projId}-2`,
      code: 'IDX-002',
      name: 'Zona Pemanfaatan Terbatas',
      landCoverType: 'Lamun',
      landCoverName: 'Zona Pemanfaatan Terbatas',
      landCoverId: `poly-${projId}-2`,
      areaHa: 28.30,
      unit: 'ha',
      description: 'Zona pemanfaatan ekowisata berkelanjutan.',
      status: 'Draft',
      spatialStatus: 'connected',
      polygonId: `poly-${projId}-2`,
      createdAt: new Date().toISOString().split('T')[0]
    }
  ];
};

