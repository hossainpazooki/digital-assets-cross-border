import { useResultsStore } from '@/stores';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/shared';
import { formatStatus } from '@/utils';
import { JurisdictionCard } from './JurisdictionCard';

export function ResultsSummary() {
  const { navigationResult } = useResultsStore();

  if (!navigationResult) {
    return null;
  }

  const statusVariant =
    navigationResult.status === 'actionable'
      ? 'success'
      : navigationResult.status === 'blocked'
        ? 'error'
        : 'warning';

  // Calculate overall risk based on conflicts and statuses
  const hasBlockingConflict = navigationResult.conflicts.some(
    (c) => c.severity === 'blocking'
  );
  const hasBlockedJurisdiction = navigationResult.jurisdiction_results.some(
    (r) => r.status === 'blocked'
  );
  const riskLevel = hasBlockingConflict || hasBlockedJurisdiction
    ? 'HIGH'
    : navigationResult.conflicts.length > 0
      ? 'MEDIUM'
      : 'LOW';

  const riskVariant =
    riskLevel === 'LOW' ? 'success' : riskLevel === 'MEDIUM' ? 'warning' : 'error';

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            Analysis Complete
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant}>
              {formatStatus(navigationResult.status)}
            </Badge>
            <Badge variant={riskVariant}>{riskLevel} RISK</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg bg-slate-700/50 p-4">
              <p className="text-sm text-slate-400">Jurisdictions</p>
              <p className="text-2xl font-bold text-white">
                {navigationResult.applicable_jurisdictions.length}
              </p>
            </div>
            <div className="rounded-lg bg-slate-700/50 p-4">
              <p className="text-sm text-slate-400">Pathway Steps</p>
              <p className="text-2xl font-bold text-white">
                {navigationResult.pathway.length}
              </p>
            </div>
            <div className="rounded-lg bg-slate-700/50 p-4">
              <p className="text-sm text-slate-400">Conflicts</p>
              <p className={`text-2xl font-bold ${
                navigationResult.conflicts.length > 0 ? 'text-yellow-400' : 'text-white'
              }`}>
                {navigationResult.conflicts.length}
              </p>
            </div>
            <div className="rounded-lg bg-slate-700/50 p-4">
              <p className="text-sm text-slate-400">Est. Timeline</p>
              <p className="text-2xl font-bold text-white">
                {navigationResult.estimated_timeline}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jurisdiction Cards */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-300">
          Jurisdiction Results
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {navigationResult.jurisdiction_results.map((result) => (
            <JurisdictionCard key={result.jurisdiction} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
}
