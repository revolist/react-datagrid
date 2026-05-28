import { createRoot, Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { ComponentType, createElement } from 'react';
import { HyperFunc, ColumnDataSchemaModel, VNode, ColumnTemplateProp } from '@revolist/revogrid';

export interface ReactElement extends HTMLElement {
  _root?: Root;
  _renderedComponent?: RenderedComponent<any>;
  _templateComponent?: ComponentType<any>;
  _templateKey?: string;
}
export interface RenderedComponent<T> {
  el: ReactElement;
  update: (newProps: T) => void;
  destroy: () => void;
  scheduleDestroy: () => void;
  cancelDestroy: () => void;
}

export function TemplateConstructor<T = ColumnDataSchemaModel>(
  el: ReactElement | null,
  ReactComponent: ComponentType<any>,
  initialProps: T,
  key: string,
  lastEl: RenderedComponent<T> | null = null,
): RenderedComponent<T> | null {
  if (!el) {
    lastEl?.scheduleDestroy();
    return lastEl;
  }

  if (lastEl && lastEl.el !== el) {
    lastEl.destroy();
  }

  // Create a root if it doesn't exist
  if (!el._root) {
    el._root = createRoot(el);
  }

  const renderedComponent = el._renderedComponent as RenderedComponent<T> | undefined;
  if (
    renderedComponent &&
    el._templateComponent === ReactComponent &&
    el._templateKey === key
  ) {
    renderedComponent.cancelDestroy();
    renderedComponent.update(initialProps);
    return renderedComponent;
  }
  renderedComponent?.destroy();
  if (!el._root) {
    el._root = createRoot(el);
  }
  const root = el._root;

  let destroyFrame: number | null = null;
  let destroyed = false;
  const renderComponent = (props: T) => {
    const vNode = createElement(ReactComponent, { ...props, key });
    flushSync(() => {
      root.render(vNode);
    });
  };
  // Initial render
  renderComponent(initialProps);
  // Update function to re-render with new props
  const update = (newProps: T) => {
    renderComponent(newProps);
  };
  // Destroy function to unmount the component
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    if (destroyFrame !== null) {
      cancelAnimationFrame(destroyFrame);
      destroyFrame = null;
    }
    root.unmount();
    if (el._root === root) {
      el._root = undefined;
      el._renderedComponent = undefined;
      el._templateComponent = undefined;
      el._templateKey = undefined;
    }
  };
  const scheduleDestroy = () => {
    if (destroyFrame !== null) return;
    destroyFrame = requestAnimationFrame(() => {
      destroyFrame = null;
      if (el.isConnected && el._renderedComponent === component) {
        return;
      }
      destroy();
    });
  };
  const cancelDestroy = () => {
    if (destroyFrame === null) return;
    cancelAnimationFrame(destroyFrame);
    destroyFrame = null;
  };

  const component = { el, update, destroy, scheduleDestroy, cancelDestroy };
  el._renderedComponent = component;
  el._templateComponent = ReactComponent;
  el._templateKey = key;

  return component;
}


/**
 * Render React component in Grid column template.
 */
export const Template = (
    ReactComponent: ComponentType<ColumnDataSchemaModel | ColumnTemplateProp>,
    customProps?: any,
  ) => {
    return (h: HyperFunc<VNode>, p: ColumnDataSchemaModel | ColumnTemplateProp, addition?: any) => {
      const props = customProps ? { ...customProps, ...p, addition } : { ...p, addition };
      const key = `${p.prop}-${p.rowIndex || 0}`;
      let lastEl: RenderedComponent<ColumnDataSchemaModel | ColumnTemplateProp> | null = null;
      return h('span', {
        key,
        ref: (el: ReactElement | null) => {
          lastEl = TemplateConstructor(el, ReactComponent, props, key, lastEl);
        },
      });
    };
  };
