import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/shared';
import { ConflictCard } from './ConflictCard';
import type { RuleConflict } from '@/types/navigate';

interface ConflictsListProps {
  conflicts: RuleConflict[];
}

export function ConflictsList({ conflicts }: ConflictsListProps) {
  const blockingCount = conflicts.filter((c) => c.severity === 'blocking').length;
  const warningCount = conflicts.filter((c) => c.severity === 'warning').length;
  const infoCount = conflicts.filter((c) => c.severity === 'info').length;

  if (conflicts.length === 0) {
    return (
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Conflicts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-green-500/10 p-6 text-center">
            <span className="text-3xl">✓</span>
            <p className="mt-2 text-green-400">
              No conflicts detected between jurisdictions.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              All regulatory requirements are compatible.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="bordered">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CardTitle>Detected Conflicts</CardTitle>
          <div className="flex gap-2">
            {blockingCount > 0 && (
              <Badge variant="error">{blockingCount} blocking</Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="warning">{warningCount} warnings</Badge>
            )}
            {infoCount > 0 && <Badge variant="info">{infoCount} info</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        {blockingCount > 0 && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">
              <strong>{blockingCount} blocking conflict(s)</strong> must be
              resolved before proceeding with cross-border operations.
            </p>
          </div>
        )}

        {/* Conflicts grouped by severity */}
        <div className="space-y-4">
          {/* Blocking first */}
          {conflicts
            .filter((c) => c.severity === 'blocking')
            .map((conflict) => (
              <ConflictCard key={conflict.id} conflict={conflict} />
            ))}

          {/* Then warnings */}
          {conflicts
            .filter((c) => c.severity === 'warning')
            .map((conflict) => (
              <ConflictCard key={conflict.id} conflict={conflict} />
            ))}

          {/* Then info */}
          {conflicts
            .filter((c) => c.severity === 'info')
            .map((conflict) => (
              <ConflictCard key={conflict.id} conflict={conflict} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
