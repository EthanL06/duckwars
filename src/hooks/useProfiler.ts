export function onRenderCallback(
  id: unknown, // the "id" prop of the Profiler tree that has just committed
  phase: unknown, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration: unknown, // time spent rendering the committed update
  baseDuration: unknown, // estimated time to render the entire subtree without memoization
  startTime: unknown, // when React began rendering this update
  commitTime: unknown, // when React committed this update
  interactions: unknown, // the Set of interactions belonging to this update
) {
  // Aggregate or log render timings...
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
  });
}
