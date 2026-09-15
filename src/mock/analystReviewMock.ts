import { AnalystFeedback } from '../types/review';

export const INITIAL_ANALYST_FEEDBACK: AnalystFeedback = {
  id: 'FB-001',
  projectId: 'PKS-994KY1',
  serviceId: 'provisioning',
  serviceName: 'Provisioning Services',
  methodId: 'market-price',
  methodName: 'Market Price',
  biota: 'flora',
  itemId: 'ROW-001',
  itemName: 'Cemara Laut',
  comment: 'Harga unit (Rp 3.231.311) perlu diperiksa kembali berdasarkan sumber data survei pedagang kayu lokal dan konversi ke satuan m³.',
  timestamp: '12 September 2026 • 15:40',
  targetQuery: {
    area: 'poly-1',
    service: 'provisioning',
    method: 'market-price',
    biota: 'flora',
    highlightRow: 'ROW-001'
  }
};
