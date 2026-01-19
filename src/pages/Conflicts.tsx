import { useResultsStore } from '@/stores';
import { Card, CardContent } from '@/components/shared';
import { ConflictsList } from '@/components/conflicts';

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

  return <ConflictsList conflicts={navigationResult.conflicts} />;
}
