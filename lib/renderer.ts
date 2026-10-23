import { createRoot, Root } from 'react-dom/client';
import { ComponentType, createElement } from 'react';
import { HyperFunc, ColumnDataSchemaModel, VNode, ColumnTemplateProp } from '@revolist/revogrid';

export interface ReactElement extends HTMLElement {
  _root?: Root;
}
export interface RenderedComponent<T> {
  update: (newProps: T) => void;
  destroy: () => void;
}

export function TemplateConstructor<T = ColumnDataSchemaModel>(
  el: ReactElement,
  ReactComponent: ComponentType<any>,
  initialProps: T,
  key: string,
): RenderedComponent<T> | null {

  // Create a root if it doesn't exist
  if (!el._root) {
    el._root = createRoot(el);
  }
  const renderComponent = (props: T) => {
    const vNode = createElement(ReactComponent, { ...props, key });
    el._root?.render(vNode);
  };
  // Initial render
  renderComponent(initialProps);
  // Update function to re-render with new props
  const update = (newProps: T) => {
    renderComponent(newProps);
  };
  // Destroy function to unmount the component
  const destroy = () => {
    el._root?.unmount();
    el._root = undefined;
  };

  return { update, destroy };
}


/**
 * Render React component in Grid column template.
 */
export const Template = <C = ColumnDataSchemaModel | ColumnTemplateProp>(
    ReactComponent: ComponentType<ColumnDataSchemaModel | ColumnTemplateProp>,
    customProps?: any,
    options?: { props?: (context: C) => Record<string, any>; key?: (context: C) => string | number },
  ) => {
    return (h: HyperFunc<VNode>, p: C, addition?: any) => {
      const props = options?.props ? options.props(p) : { ...customProps, ...p, addition };
      const key = String(options?.key?.(p) ?? `${(p as any).prop}-${(p as any).rowIndex || 0}`);
      let lastEl: RenderedComponent<any> | null = null;
      return h('span', {
        ref: (el: ReactElement | null) => {
            if (!el) {
              lastEl?.destroy?.();
            } else {
              lastEl = TemplateConstructor(el, ReactComponent, props, key);
            }
        },
      });
    };
  };