export type LandCoverType = 'mangrove' | 'lamun' | 'terumbu_karang' | 'perairan' | 'lainnya';

export interface ServiceValueDetail {
  serviceId: 'provisioning' | 'regulating' | 'supporting' | 'cultural';
  methodName: string;
  value: number;
  status: 'draft' | 'verified';
}

export interface LandCoverPolygon {
  id: string;
  code: string;
  name: string;
  type: LandCoverType;
  areaHa: number;
  coordinates: [number, number][]; // LatLng points for Leaflet Polygon
  center: [number, number];
  indexId?: string;
  indexCode?: string;
  indexName?: string;
  activeServices: ('provisioning' | 'regulating' | 'supporting' | 'cultural')[];
  serviceDetails: ServiceValueDetail[];
  totalValue: number;
}

export interface IndexItem {
  id: string;
  code: string;
  name: string;
  landCoverType: LandCoverType | string;
  landCoverName?: string;
  landCoverId?: string; // id polygon jika terhubung
  areaHa: number;
  unit?: string;
  description: string;
  status: 'Draft' | 'Selesai';
  spatialStatus: 'connected' | 'unconnected';
  polygonId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MapLayer {
  id: string;
  projectId: string;
  name: string;
  type: 'polygon' | 'line' | 'point';
  featureCount: number;
  crs: string;
  color: string;
  visible: boolean;
  updatedAt: string;
}
