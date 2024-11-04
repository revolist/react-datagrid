import type {
  EditCell,
  ColumnDataSchemaModel,
  HyperFunc,
  VNode,
  EditorBase,
} from '@revolist/revogrid';
import { ReactElement, RenderedComponent, TemplateConstructor } from './renderer';
import type { ComponentType } from 'react';

/**
 * Data passed to editor
 */
export type EditorType = {
  column: ColumnDataSchemaModel;
  save: (value: any, preventFocus?: boolean) => void;
  close: (focusNext?: boolean) => void;
} & Partial<EditCell>;

export class EditorAdapter implements EditorBase {
  public element: ReactElement | null = null;
  public editCell?: EditCell;
  private renderedComponent: RenderedComponent<EditorType> | null = null;

  constructor(
    private EditorComponent: ComponentType<EditorType>,
    public column: ColumnDataSchemaModel,
    private save: (value: any, preventFocus?: boolean) => void,
    private close: (focusNext?: boolean) => void,
  ) {}

  // optional, called after editor rendered
  componentDidRender() {}

  // optional, called after editor destroyed
  disconnectedCallback() {
    this.renderedComponent?.destroy();
    this.renderedComponent = null;
  }

  render(h: HyperFunc<VNode>) {
    return h('span', {
      key: `${this.column.prop}-${this.editCell?.rowIndex || 0}`,
      ref: (el: ReactElement) => 
        this.renderedComponent = TemplateConstructor(
          el,
          this.EditorComponent,
          {
            ...this.editCell,
            column: this.column,
            save: this.save,
            close: this.close,
          },
          this.renderedComponent,
        ),
      });
    }
}



