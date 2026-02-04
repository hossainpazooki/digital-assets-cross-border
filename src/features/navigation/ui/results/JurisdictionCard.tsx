import { useState } from 'react';
import { Card, CardContent, Badge } from '@shared/ui';
import { getJurisdictionInfo } from '@entities/jurisdiction/model';
import { formatStatus } from '@shared/lib';
import type { JurisdictionResult } from '@/types/navigate';

interface JurisdictionCardProps {
  result: JurisdictionResult;
}

export function JurisdictionCard({ result }: JurisdictionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const info = getJurisdictionInfo(result.jurisdiction);

  const statusVariant =
    result.status === 'compliant'
      ? 'success'
      : result.status === 'blocked'
        ? 'error'
        : 'warning';

  return (
    <Card
      variant="bordered"
      className={`cursor-pointer transition-all ${
        isExpanded ? 'ring-2 ring-amber-500/50' : 'hover:border-slate-500'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{info.flag}</span>
            <div>
              <p className="font-semibold text-white">{result.jurisdiction}</p>
              <p className="text-xs text-slate-400">
                {result.role.replace('_', ' ')}
              </p>
            </div>
          </div>
          <Badge variant={statusVariant} size="sm">
            {formatStatus(result.status)}
          </Badge>
        </div>

        {/* Stats */}
        <div className="mt-3 text-xs text-slate-400">
          {result.rules_evaluated}/{result.applicable_rules} rules evaluated
        </div>

        {/* Decisions Preview */}
        <div className="mt-3 space-y-1">
          {result.decisions.slice(0, 2).map((decision, i) => (
            <p key={i} className="truncate text-sm text-slate-300">
              • {decision.decision}
            </p>
          ))}
          {result.decisions.length > 2 && (
            <p className="text-xs text-slate-500">
              +{result.decisions.length - 2} more decisions
            </p>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 border-t border-slate-700 pt-4">
            {/* Regime Info */}
            <div className="mb-4">
              <p className="text-xs font-medium uppercase text-slate-400">
                Regime
              </p>
              <p className="text-sm text-white">{result.regime_id}</p>
              <p className="text-xs text-slate-400">{info.framework}</p>
            </div>

            {/* All Decisions */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-medium uppercase text-slate-400">
                Decisions ({result.decisions.length})
              </p>
              <div className="space-y-2">
                {result.decisions.map((decision, i) => (
                  <div
                    key={i}
                    className="rounded bg-slate-800/50 p-2 text-sm"
                  >
                    <p className="text-slate-200">{decision.decision}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Rule: {decision.rule_id}
                    </p>
                    {/* Decision Trace */}
                    {decision.trace && decision.trace.length > 0 && (
                      <div className="mt-2 border-t border-slate-700 pt-2">
                        <p className="mb-1 text-xs font-medium text-slate-400">
                          Decision Trace:
                        </p>
                        <div className="space-y-1">
                          {decision.trace.map((step, j) => (
                            <div
                              key={j}
                              className="flex items-start gap-2 text-xs"
                            >
                              <span
                                className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                                  step.result ? 'bg-green-500' : 'bg-red-500'
                                }`}
                              />
                              <div className="flex-1">
                                <span className="text-slate-300">
                                  {step.condition}
                                </span>
                                {step.explanation && (
                                  <p className="text-slate-500">
                                    {step.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Source Reference */}
                    {decision.source && (
                      <p className="mt-1 text-xs text-blue-400">
                        Source: {decision.source.document_id}
                        {decision.source.article && ` Art. ${decision.source.article}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Obligations */}
            {result.obligations.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-slate-400">
                  Obligations ({result.obligations.length})
                </p>
                <div className="space-y-2">
                  {result.obligations.map((obligation) => (
                    <div
                      key={obligation.id}
                      className="rounded bg-slate-800/50 p-2 text-sm"
                    >
                      <p className="text-slate-200">{obligation.description}</p>
                      {obligation.deadline && (
                        <p className="mt-1 text-xs text-amber-400">
                          Deadline: {obligation.deadline}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expand hint */}
        <div className="mt-3 text-center text-xs text-slate-500">
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </div>
      </CardContent>
    </Card>
  );
}
