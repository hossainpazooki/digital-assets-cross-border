import { useState } from 'react';
import { Badge } from '@/components/shared';
import { getJurisdictionInfo } from '@/constants';
import { formatStatus } from '@/utils';
import type { RuleConflict } from '@/types/navigate';

interface ConflictCardProps {
  conflict: RuleConflict;
}

const RESOLUTION_ICONS: Record<string, string> = {
  cumulative: '📋',
  stricter: '🔒',
  home_jurisdiction: '🏠',
  satisfy_both: '⚖️',
  earliest: '⏰',
};

const RESOLUTION_DESCRIPTIONS: Record<string, string> = {
  cumulative: 'Apply all requirements from both jurisdictions',
  stricter: 'Apply the stricter of the two requirements',
  home_jurisdiction: 'Follow home jurisdiction rules',
  satisfy_both: 'Must satisfy requirements from both jurisdictions',
  earliest: 'Use the earliest deadline',
};

export function ConflictCard({ conflict }: ConflictCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const severityVariant =
    conflict.severity === 'blocking'
      ? 'error'
      : conflict.severity === 'warning'
        ? 'warning'
        : 'info';

  const severityIcon =
    conflict.severity === 'blocking'
      ? '🚫'
      : conflict.severity === 'warning'
        ? '⚠️'
        : 'ℹ️';

  return (
    <div
      className={`rounded-lg border bg-slate-700/30 p-4 transition-all ${
        conflict.severity === 'blocking'
          ? 'border-red-500/50'
          : conflict.severity === 'warning'
            ? 'border-amber-500/50'
            : 'border-slate-600'
      } ${isExpanded ? 'ring-2 ring-blue-500/30' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{severityIcon}</span>
          <div className="flex items-center gap-2">
            {conflict.jurisdictions.map((code) => {
              const info = getJurisdictionInfo(code);
              return (
                <span key={code} className="text-xl" title={info.name}>
                  {info.flag}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={severityVariant} size="sm">
            {conflict.severity}
          </Badge>
          <Badge variant="default" size="sm">
            {formatStatus(conflict.type)}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-white">{conflict.description}</p>

      {/* Resolution Strategy */}
      <div
        className="mt-4 cursor-pointer rounded-lg bg-slate-800/50 p-3 transition-colors hover:bg-slate-800/70"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{RESOLUTION_ICONS[conflict.resolution_strategy] || '📝'}</span>
            <p className="text-sm font-medium text-white">
              {formatStatus(conflict.resolution_strategy)}
            </p>
          </div>
          <svg
            className={`h-4 w-4 text-slate-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-3 border-t border-slate-700 pt-3">
            <p className="text-sm text-slate-400">
              {RESOLUTION_DESCRIPTIONS[conflict.resolution_strategy] ||
                'Follow the specified resolution approach'}
            </p>

            {conflict.resolution_note && (
              <div className="rounded bg-slate-700/50 p-2">
                <p className="text-xs font-medium text-slate-400">Note</p>
                <p className="mt-1 text-sm text-slate-300">
                  {conflict.resolution_note}
                </p>
              </div>
            )}

            {conflict.obligations && conflict.obligations.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Affected Obligations
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-300">
                  {conflict.obligations.map((ob, i) => (
                    <li key={i}>{ob}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
