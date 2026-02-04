/**
 * Canvas Context Hooks
 * Thin hooks that provide access to specific slices of the CanvasContext
 */

import { useContext } from 'react';
import { CanvasContext, type CanvasContextValue } from '@app/contexts';

/**
 * Access the full canvas context
 * @throws Error if used outside CanvasProvider
 */
export function useCanvasContext(): CanvasContextValue {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }
  return context;
}

/**
 * Access panel state and actions
 */
export function usePanelState() {
  const { panels, togglePanel, expandPanel, collapsePanel, focusExpandPanel, resetPanels } =
    useCanvasContext();
  return { panels, togglePanel, expandPanel, collapsePanel, focusExpandPanel, resetPanels };
}

/**
 * Access canvas-wide state and actions
 */
export function useCanvasState() {
  const {
    canvas,
    setCanvasState,
    setCanvasError,
    clearCanvasError,
    markInputsChanged,
    markInputsSynced,
    resetCanvas,
    navigationResult,
    analysisComplete,
  } = useCanvasContext();
  return {
    canvas,
    setCanvasState,
    setCanvasError,
    clearCanvasError,
    markInputsChanged,
    markInputsSynced,
    resetCanvas,
    navigationResult,
    analysisComplete,
  };
}

/**
 * Access tree highlight state and actions
 */
export function useTreeHighlight() {
  const {
    tree,
    selectNode,
    highlightNodes,
    clearHighlight,
    toggleGroup,
    expandGroup,
    collapseGroup,
    resetTree,
  } = useCanvasContext();
  return {
    tree,
    selectNode,
    highlightNodes,
    clearHighlight,
    toggleGroup,
    expandGroup,
    collapseGroup,
    resetTree,
  };
}
