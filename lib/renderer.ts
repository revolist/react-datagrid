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
  el: ReactElement | null,
  ReactComponent: ComponentType<any>,
  initialProps: T,
  lastEl: RenderedComponent<T> | null = null,
): RenderedComponent<T> | null {
  if (!el) {
    lastEl?.destroy?.();
    return null;
  }

  // Create a root if it doesn't exist
  if (!el._root) {
    el._root = createRoot(el);
  }
  const renderComponent = (props: T) => {
    const vNode = createElement(ReactComponent, props);
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
export const Template = (
    ReactComponent: ComponentType<ColumnDataSchemaModel | ColumnTemplateProp>,
    customProps?: any,
  ) => {
    return (h: HyperFunc<VNode>, p: ColumnDataSchemaModel | ColumnTemplateProp, addition?: any) => {
      const props = customProps ? { ...customProps, ...p } : p;
      props.addition = addition;
      let lastEl: RenderedComponent<ColumnDataSchemaModel> | null = null;
      return h('span', {
        key: `${p.prop}-${p.rowIndex || 0}`,
        ref: (el: ReactElement | null) => {
            lastEl = TemplateConstructor(el, ReactComponent, props, lastEl);
        }
      });
    };
  };
  