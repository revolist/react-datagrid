import { useMemo, type ComponentType } from 'react';
import { Template } from './renderer';

/** Bind the existing template factory for use on any content surface. */
export function useTemplates() {
  return useMemo(() => ({
    template<C>(component: ComponentType<any>, options?: Parameters<typeof Template<C>>[2]) {
      const adapted = { ...options, props: options?.props ?? ((context: C) => ({ context })) };
      return Template<C>(component, undefined, adapted);
    },
  }), []);
}

export type ReactTemplateOwner = ReturnType<typeof useTemplates>;
