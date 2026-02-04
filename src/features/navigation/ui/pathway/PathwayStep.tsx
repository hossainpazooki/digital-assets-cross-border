import { Badge } from '@shared/ui';
import { getJurisdictionInfo } from '@entities/jurisdiction/model';
import { formatTimeline, formatStatus } from '@shared/lib';
import type { PathwayStep as PathwayStepType } from '@/types/navigate';

interface PathwayStepProps {
  step: PathwayStepType;
  stepNumber: number;
  isLast?: boolean;
}

export function PathwayStep({ step, stepNumber, isLast = false }: PathwayStepProps) {
  const info = getJurisdictionInfo(step.jurisdiction);

  const statusVariant =
    step.status === 'completed'
      ? 'success'
      : step.status === 'waived'
        ? 'warning'
        : 'default';

  const statusIcon =
    step.status === 'completed'
      ? '✓'
      : step.status === 'waived'
        ? '⊘'
        : '○';

  return (
    <div className="relative flex gap-4 pl-12">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-6 top-12 h-[calc(100%+1.5rem)] w-0.5 bg-slate-700" />
      )}

      {/* Step number circle */}
      <div
        className={`absolute left-0 flex h-12 w-12 items-center justify-center rounded-full text-white ${
          step.status === 'completed'
            ? 'bg-green-600'
            : step.status === 'waived'
              ? 'bg-amber-600'
              : 'bg-slate-700'
        }`}
      >
        {step.status === 'pending' ? stepNumber : statusIcon}
      </div>

      {/* Step content */}
      <div className="flex-1 rounded-lg bg-slate-700/30 p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{info.flag}</span>
              <h4 className="font-medium text-white">{step.action}</h4>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {info.name} - {info.framework}
            </p>
          </div>
          <Badge variant={statusVariant} size="sm">
            {formatStatus(step.status)}
          </Badge>
        </div>

        {/* Timeline & Dependencies */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white">
              {formatTimeline(step.timeline.min_days, step.timeline.max_days)}
            </span>
          </span>
          {step.prerequisites.length > 0 && (
            <span className="flex items-center gap-1 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Requires: {step.prerequisites.join(', ')}
            </span>
          )}
        </div>

        {/* Source */}
        {step.source && (
          <p className="mt-2 text-xs text-slate-500">
            <span className="text-slate-400">Source:</span> {step.source.document_id}
            {step.source.article && ` Art. ${step.source.article}`}
            {step.source.paragraph && ` §${step.source.paragraph}`}
          </p>
        )}

        {/* Waiver reason */}
        {step.waiver_reason && (
          <div className="mt-2 rounded bg-amber-500/10 px-2 py-1 text-xs text-amber-400">
            Waiver: {step.waiver_reason}
          </div>
        )}
      </div>
    </div>
  );
}
