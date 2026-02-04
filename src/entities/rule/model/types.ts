import type { JurisdictionCode } from '@entities/jurisdiction/model';

/**
 * Metadata for a rule definition
 */
export interface RuleMetadata {
  jurisdiction: JurisdictionCode;
  framework: string;
  effectiveDate: string;
  expiresDate?: string;
  tags?: string[];
}

/**
 * A complete rule definition (JSON format)
 * Note: DecisionNode type is defined in features/decision-tree
 */
export interface RuleDefinition {
  id: string;
  version: string;
  name: string;
  description?: string;
  metadata: RuleMetadata;
  tree: unknown; // DecisionNode - circular dependency avoided
}
