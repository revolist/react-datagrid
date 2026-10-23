import {
  createElement, Fragment, useEffect, useLayoutEffect, useRef, useSyncExternalStore,
  type ComponentType, type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import type { ComponentTemplate } from '@revolist/revogrid';

interface Entry {
  id: number;
  host: HTMLElement;
  component: ComponentType<any>;
  props: Record<string, unknown>;
}
export interface ReactTemplateOwner {
  template<C>(component: ComponentType<any>, options?: {
    props?: (context: C) => Record<string, unknown>;
  }): ComponentTemplate<C>;
  dispose(): void;
}
const OWNER_STATE = Symbol('ReactTemplateOwner');
const EMPTY: readonly Entry[] = [];
interface OwnerState {
  isAttached(): boolean;
  attachOutlet(): () => void;
  lifecycle?: object;
  outletLifecycle?: object;
  subscribe(listener: () => void): () => void;
  snapshot(): readonly Entry[];
}
interface InternalOwner extends ReactTemplateOwner { [OWNER_STATE]: OwnerState }

function createOwner(): InternalOwner {
  const entries = new Map<number, Entry>();
  const listeners = new Set<() => void>();
  let snapshot: readonly Entry[] = EMPTY;
  let nextId = 0;
  let disposed = false;
  let attached = false;
  let outletActive = false;
  let publicationPending = false;
  const notify = () => {
    if (publicationPending) return;
    publicationPending = true;
    queueMicrotask(() => {
      publicationPending = false;
      snapshot = [...entries.values()];
      listeners.forEach(listener => listener());
    });
  };
  const state: OwnerState = {
    isAttached: () => attached,
    attachOutlet() {
      if (outletActive) throw new Error('A React template owner supports exactly one outlet.');
      outletActive = true;
      attached = true;
      // Suspense releases layout effects while preserving the mounted outlet.
      // Keep accepting hosts until passive teardown confirms final disposal.
      return () => { outletActive = false; };
    },
    subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    snapshot: () => snapshot,
  };
  return {
    [OWNER_STATE]: state,
    template<C>(component: ComponentType<any>, options?: { props?: (context: C) => Record<string, unknown> }): ComponentTemplate<C> {
      const props = (context: C) => ({ ...(options?.props ? options.props(context) : { context }) });
      return {
        kind: 'revo-component-template',
        mount(host, context) {
          if (disposed) throw new Error('Cannot mount a template from a disposed React template owner.');
          if (!state.isAttached()) throw new Error('Render RevoTemplateOutlet for this React template owner before mounting templates.');
          const id = nextId++;
          entries.set(id, { id, host, component, props: props(context) });
          notify();
          return {
            update(next) {
              const entry = entries.get(id);
              if (!disposed && entry) { entries.set(id, { ...entry, props: props(next) }); notify(); }
            },
            destroy() { if (entries.delete(id)) notify(); },
          };
        },
      };
    },
    dispose() { if (!disposed) { disposed = true; entries.clear(); notify(); } },
  };
}

/** Passive teardown distinguishes final unmount from Suspense layout cleanup. */
function useOwnerDisposal(owner: ReactTemplateOwner, state: OwnerState, lifetime: 'lifecycle' | 'outletLifecycle') {
  useEffect(() => {
    // StrictMode replays effects with the same owner; cancel its stale teardown.
    const token = {};
    state[lifetime] = token;
    return () => {
      queueMicrotask(() => {
        if (state[lifetime] === token) owner.dispose();
      });
    };
  }, [owner, state, lifetime]);
}

/** Call in a component and render its outlet beneath the providers to inherit. */
export function useTemplates(): ReactTemplateOwner {
  const ref = useRef<InternalOwner | null>(null);
  if (!ref.current) ref.current = createOwner();
  const owner = ref.current;
  useOwnerDisposal(owner, owner[OWNER_STATE], 'lifecycle');
  return owner;
}

/** Portals preserve the caller's React Context; no per-host React root is created. */
export function RevoTemplateOutlet({ owner }: { owner: ReactTemplateOwner }): ReactElement {
  const state = (owner as InternalOwner)[OWNER_STATE];
  if (!state) throw new Error('Invalid React template owner.');
  const entries = useSyncExternalStore(state.subscribe, state.snapshot, () => EMPTY);
  useLayoutEffect(state.attachOutlet, [state]);
  useOwnerDisposal(owner, state, 'outletLifecycle');
  return createElement(Fragment, null, entries.map(entry =>
    createPortal(createElement(entry.component, entry.props), entry.host, String(entry.id)),
  ));
}
