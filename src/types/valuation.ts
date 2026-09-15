export type EcosystemServiceId = 'provisioning' | 'regulating' | 'supporting' | 'cultural';

export type BiotaCategory = 'flora' | 'fauna';

export interface ValuationMethod {
  id: string;
  name: string;
  subtitle: string;
  category: EcosystemServiceId;
  description: string;
  allowedBiota?: BiotaCategory[];
  formulaDescription: string;
}

export interface EcosystemServiceConfig {
  id: EcosystemServiceId;
  name: string;
  nameId: string;
  description: string;
  badgeColor: string;
  badgeBg: string;
  methods: ValuationMethod[];
}

export interface AreaServiceConfig {
  activeServices: Record<EcosystemServiceId, boolean>;
  selectedMethods: Record<EcosystemServiceId, string>;
  biota?: BiotaCategory;
}
