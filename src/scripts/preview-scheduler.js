// Finite demonstrations release slots; returning entries join the queue tail.
export function createPreviewScheduler(onChange, limit = 2) {
  const entries = new Map();
  let hidden = false;
  function sync() {
    onChange(hidden ? [] : [...entries.values()]
      .filter(e => e.auto && e.visible && !e.done && !e.stopped)
      .slice(0, limit).map(e => e.id));
  }
  return {
    register(id, auto) { entries.set(id, { id, auto, visible: false, done: false, stopped: false }); sync(); },
    visible(id, visible) { const e = entries.get(id); if (e) { e.visible = visible; sync(); } },
    requeue(id) { const e = entries.get(id); if (e) { e.done = false; entries.delete(id); entries.set(id, e); sync(); } },
    stop(id) { const e = entries.get(id); if (e) { e.stopped = true; sync(); } },
    complete(id) { const e = entries.get(id); if (e) { e.done = true; sync(); } },
    remove(id) { entries.delete(id); sync(); },
    configure(options) { limit = options.limit; hidden = options.hidden; sync(); }
  };
}

