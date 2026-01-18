import { useResultsStore } from '@/stores';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/shared';
import { getJurisdictionInfo } from '@/constants';
import { formatStatus } from '@/utils';

export function Conflicts() {
  const { navigationResult } = useResultsStore();

  if (!navigationResult) {
    return (
      <Card variant="bordered">
        <CardContent>
          <p className="text-center text-slate-400">
            Run an analysis first to see detected conflicts.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (navigationResult.conflicts.length === 0) {
    return (
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Conflicts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-green-500/10 p-6 text-center">
            <p className="text-green-400">
              No conflicts detected between jurisdictions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Detected Conflicts</CardTitle>
        <Badge variant="warning">{navigationResult.conflicts.length} conflicts</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {navigationResult.conflicts.map((conflict) => {
            const severityVariant =
              conflict.severity === 'blocking'
                ? 'error'
                : conflict.severity === 'warning'
                  ? 'warning'
                  : 'info';

            return (
              <div
                key={conflict.id}
                className="rounded-lg border border-slate-600 bg-slate-700/30 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {conflict.jurisdictions.map((code) => {
                      const info = getJurisdictionInfo(code);
                      return (
                        <span key={code} className="text-xl" title={info.name}>
                          {info.flag}
                        </span>
                      );
                    })}
                    <Badge variant={severityVariant} size="sm">
                      {conflict.severity}
                    </Badge>
                  </div>
                  <Badge variant="default" size="sm">
                    {formatStatus(conflict.type)}
                  </Badge>
                </div>

                <p className="mt-3 text-white">{conflict.description}</p>

                <div className="mt-4 rounded-lg bg-slate-800/50 p-3">
                  <p className="text-xs font-medium uppercase text-slate-400">
                    Resolution Strategy
                  </p>
                  <p className="mt-1 text-sm text-white">
                    {formatStatus(conflict.resolution_strategy)}
                  </p>
                  {conflict.resolution_note && (
                    <p className="mt-1 text-xs text-slate-400">
                      {conflict.resolution_note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
