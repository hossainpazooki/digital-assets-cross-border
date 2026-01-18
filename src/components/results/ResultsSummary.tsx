import { useResultsStore } from '@/stores';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/shared';
import { getJurisdictionInfo } from '@/constants';
import { formatStatus } from '@/utils';

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

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <Badge variant={statusVariant}>
          {formatStatus(navigationResult.status)}
        </Badge>
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
            <p className="text-sm text-slate-400">Conflicts</p>
            <p className="text-2xl font-bold text-white">
              {navigationResult.conflicts.length}
            </p>
          </div>
          <div className="rounded-lg bg-slate-700/50 p-4">
            <p className="text-sm text-slate-400">Pathway Steps</p>
            <p className="text-2xl font-bold text-white">
              {navigationResult.pathway.length}
            </p>
          </div>
          <div className="rounded-lg bg-slate-700/50 p-4">
            <p className="text-sm text-slate-400">Timeline</p>
            <p className="text-2xl font-bold text-white">
              {navigationResult.estimated_timeline}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="mb-3 text-sm font-medium text-slate-300">
            Jurisdiction Results
          </h4>
          <div className="space-y-2">
            {navigationResult.jurisdiction_results.map((result) => {
              const info = getJurisdictionInfo(result.jurisdiction);
              const statusBadge =
                result.status === 'compliant'
                  ? 'success'
                  : result.status === 'blocked'
                    ? 'error'
                    : 'warning';

              return (
                <div
                  key={result.jurisdiction}
                  className="flex items-center justify-between rounded-lg bg-slate-700/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{info.flag}</span>
                    <div>
                      <p className="font-medium text-white">{info.name}</p>
                      <p className="text-xs text-slate-400">
                        {info.framework} ({result.role})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">
                      {result.rules_evaluated} rules
                    </span>
                    <Badge variant={statusBadge}>
                      {formatStatus(result.status)}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
