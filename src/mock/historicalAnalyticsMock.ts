export interface HistoricalLocationStudy {
  id: string;
  year: number;
  studyTitle: string;
  areaId: string;
  polygonCode: string;
  areaName: string;
  locationRegion: string;
  areaHa: number;
  tev: number;
  tevPerHa: number;
  servicesBreakdown: {
    provisioning: number;
    regulating: number;
    supporting: number;
    cultural: number;
  };
  institution: string;
  reportReference: string;
}

// Database riwayat penelitian terdahulu berdasarkan identitas lokasi / polygon spesifik
export const HISTORICAL_LOCATION_STUDIES: Record<string, HistoricalLocationStudy[]> = {
  // Teluk Benoa - Mangrove Barat (poly-1 / TL-MG-01)
  'poly-1': [
    {
      id: 'HIST-TB-2022',
      year: 2022,
      studyTitle: 'Valuasi Jasa Ekosistem Mangrove Teluk Benoa (Baseline 2022)',
      areaId: 'poly-1',
      polygonCode: 'TL-MG-01',
      areaName: 'Mangrove Barat',
      locationRegion: 'Teluk Benoa, Bali',
      areaHa: 80.00,
      tev: 18000000000,
      tevPerHa: 225000000,
      servicesBreakdown: {
        provisioning: 14400000000,
        regulating: 1800000000,
        supporting: 1080000000,
        cultural: 720000000,
      },
      institution: 'PKSPL IPB & Dinas Kehutanan Bali',
      reportReference: 'Laporan Inventarisasi Ekosistem Pesisir 2022'
    },
    {
      id: 'HIST-TB-2024',
      year: 2024,
      studyTitle: 'Studi Valuasi Ekonomi Sumberdaya Pesisir Teluk Benoa',
      areaId: 'poly-1',
      polygonCode: 'TL-MG-01',
      areaName: 'Mangrove Barat',
      locationRegion: 'Teluk Benoa, Bali',
      areaHa: 79.86,
      tev: 21300000000,
      tevPerHa: 266716754,
      servicesBreakdown: {
        provisioning: 16827000000,
        regulating: 2130000000,
        supporting: 1384500000,
        cultural: 958500000,
      },
      institution: 'PKSPL IPB & Kementerian Kelautan dan Perikanan',
      reportReference: 'Laporan Valuasi Sumberdaya Alam 2024'
    }
  ]
};

/**
 * Mencari data penelitian historis berdasarkan identitas area yang kuat:
 * ID Polygon, Kode Polygon, atau Nama Area Tutupan Lahan.
 */
export const getHistoricalStudiesForArea = (
  areaId?: string,
  areaName?: string,
  polygonCode?: string
): HistoricalLocationStudy[] => {
  if (areaId && HISTORICAL_LOCATION_STUDIES[areaId]) {
    return HISTORICAL_LOCATION_STUDIES[areaId];
  }

  // Pencocokan alternatif berdasarkan kode polygon atau nama area
  for (const list of Object.values(HISTORICAL_LOCATION_STUDIES)) {
    if (list.some(s =>
      (polygonCode && s.polygonCode.toLowerCase() === polygonCode.toLowerCase()) ||
      (areaName && s.areaName.toLowerCase() === areaName.toLowerCase())
    )) {
      return list;
    }
  }

  return [];
};
