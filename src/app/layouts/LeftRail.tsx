/**
 * LeftRail Component
 * Contains the ScenarioBuilder form for configuring compliance scenarios
 */

import { usePanelState } from '@/hooks';
import { useNavigationStore, ScenarioBuilder } from '@features/navigation';
import { Badge } from '@shared/ui';
import { LeftRailArea } from './CanvasLayout';
import { PanelHeader } from '@shared/ui';
import { JURISDICTIONS } from '@entities/jurisdiction/model';

export function LeftRail() {
  const { panels, togglePanel } = usePanelState();
  const store = useNavigationStore();

  const isExpanded = panels.leftRail === 'expanded';

  // Build summary for collapsed state
  const targetFlags = store.targetJurisdictions
    .map((code) => JURISDICTIONS[code]?.flag || code)
    .join(' ');

  const summary = `${JURISDICTIONS[store.issuerJurisdiction]?.flag || store.issuerJurisdiction} → ${targetFlags || 'No targets'}`;

  return (
    <LeftRailArea>
      <PanelHeader
        title="Scenario"
        isExpanded={isExpanded}
        onToggle={() => togglePanel('leftRail')}
        summary={summary}
        badge={
          store.targetJurisdictions.length > 0 && (
            <Badge variant="info" size="sm">
              {store.targetJurisdictions.length} targets
            </Badge>
          )
        }
      />

      <ScenarioBuilder className="flex-1 overflow-hidden" />
    </LeftRailArea>
  );
}
