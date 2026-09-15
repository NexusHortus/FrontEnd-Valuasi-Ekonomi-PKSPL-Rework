export interface ReviewCheckItem {
  id: string;
  title: string;
  stepNum: string;
  description: string;
  isComplete: boolean;
  required: boolean;
  targetRoute: string;
}

export interface AnalystFeedback {
  id: string;
  projectId: string;
  serviceId: string;
  serviceName: string;
  methodId: string;
  methodName: string;
  biota?: string;
  itemId: string;
  itemName: string;
  comment: string;
  timestamp: string;
  targetQuery: {
    area: string;
    service: string;
    method: string;
    biota?: string;
    highlightRow: string;
  };
}
