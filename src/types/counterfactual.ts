import type { ScenarioType, ExplanationTier, RiskLevel } from './common';
import type { Citation } from './decoder';

// Counterfactual scenario definition
export interface Scenario {
  type: ScenarioType;
  name?: string;
  parameters: Record<string, unknown>;
}

// Outcome summary
export interface OutcomeSummary {
  status: string;
  framework: string;
  risk_level: RiskLevel;
  conditions: string[];
}

// Delta analysis between baseline and counterfactual
export interface DeltaAnalysis {
  status_changed: boolean;
  status_from: string;
  status_to: string;
  framework_changed: boolean;
  frameworks_added: string[];
  frameworks_removed: string[];
  risk_delta: number; // -2 to +2
  risk_factors_added: string[];
  risk_factors_removed: string[];
  new_requirements: string[];
  removed_requirements: string[];
  modified_requirements: Array<{ from: string; to: string }>;
  estimated_cost_delta?: number;
  estimated_time_delta?: number;
  position_limit_delta?: number;
}

// Counterfactual explanation
export interface CounterfactualExplanation {
  summary: string;
  key_differences: Array<{ aspect: string; description: string }>;
}

// Request to /counterfactual/analyze/inline
export interface InlineAnalyzeRequest {
  instrument_type?: string;
  activity?: string;
  jurisdiction?: string;
  authorized?: boolean;
  actor_type?: string;
  issuer_type?: string;
  is_credit_institution?: boolean;
  is_authorized_institution?: boolean;
  reference_asset?: string;
  is_significant?: boolean;
  reserve_value_eur?: number;
  extra?: Record<string, unknown>;
  rule_id?: string;
  scenario: Scenario;
  include_explanation: boolean;
  explanation_tier: ExplanationTier;
}

// Counterfactual response
export interface CounterfactualResponse {
  counterfactual_id: string;
  baseline_decision_id: string;
  generated_at: string;
  scenario_applied: Scenario;
  baseline_outcome: OutcomeSummary;
  counterfactual_outcome: OutcomeSummary;
  delta: DeltaAnalysis;
  explanation?: CounterfactualExplanation;
  citations: Citation[];
}

// Comparison insight
export interface ComparisonInsight {
  type: 'recommendation' | 'warning' | 'opportunity';
  text: string;
}

// Comparison matrix for multiple scenarios
export interface ComparisonMatrix {
  comparison_id: string;
  generated_at: string;
  baseline: OutcomeSummary;
  scenarios: Scenario[];
  results: CounterfactualResponse[];
  matrix: Record<string, string[]>;
  insights: ComparisonInsight[];
}
