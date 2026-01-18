import { useResultsStore } from '@/stores';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/shared';
import { getJurisdictionInfo } from '@/constants';
import { formatTimeline, formatStatus } from '@/utils';

export function Pathway() {
  const { navigationResult } = useResultsStore();

  if (!navigationResult) {
    return (
      <Card variant="bordered">
        <CardContent>
          <p className="text-center text-slate-400">
            Run an analysis first to see the compliance pathway.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Compliance Pathway</CardTitle>
          <Badge variant="info">
            {navigationResult.estimated_timeline}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 h-full w-0.5 bg-slate-700" />

            {/* Steps */}
            <div className="space-y-6">
              {navigationResult.pathway.map((step, index) => {
                const info = getJurisdictionInfo(step.jurisdiction);
                const statusVariant =
                  step.status === 'completed'
                    ? 'success'
                    : step.status === 'waived'
                      ? 'warning'
                      : 'default';

                return (
                  <div key={step.step_id} className="relative flex gap-4 pl-12">
                    {/* Step number circle */}
                    <div className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-white">
                      {index + 1}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 rounded-lg bg-slate-700/30 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{info.flag}</span>
                            <h4 className="font-medium text-white">
                              {step.action}
                            </h4>
                          </div>
                          <p className="mt-1 text-sm text-slate-400">
                            {info.name} - {info.framework}
                          </p>
                        </div>
                        <Badge variant={statusVariant} size="sm">
                          {formatStatus(step.status)}
                        </Badge>
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <span className="text-slate-400">
                          Timeline:{' '}
                          <span className="text-white">
                            {formatTimeline(step.timeline.min_days, step.timeline.max_days)}
                          </span>
                        </span>
                        {step.prerequisites.length > 0 && (
                          <span className="text-slate-400">
                            Depends on: {step.prerequisites.join(', ')}
                          </span>
                        )}
                      </div>

                      {step.source && (
                        <p className="mt-2 text-xs text-slate-500">
                          Source: {step.source.document_id}
                          {step.source.article && ` Art. ${step.source.article}`}
                        </p>
                      )}

                      {step.waiver_reason && (
                        <p className="mt-2 text-xs text-amber-400">
                          Waiver: {step.waiver_reason}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cumulative Obligations */}
      {navigationResult.cumulative_obligations.length > 0 && (
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Cumulative Obligations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {navigationResult.cumulative_obligations.map((obligation) => (
                <div
                  key={obligation.id}
                  className="rounded-lg bg-slate-700/30 p-3"
                >
                  <p className="text-white">{obligation.description}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Applies to: {obligation.jurisdictions.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
