import {
  EditCell,
  ColumnDataSchemaModel,
  HyperFunc,
  VNode,
  SaveData,
} from '@revolist/revogrid';
import { ReactElement, RenderedComponent, TemplateConstructor } from './renderer';
import { ComponentType } from 'react';

export type EditorType = {
  save: (value: SaveData, preventFocus?: boolean) => void;
  close: (focusNext?: boolean) => void;
  column: ColumnDataSchemaModel;
} & Partial<EditCell>;

export class EditorAdapter {
  public element: ReactElement | null = null;
  public editCell: EditCell | null = null;
  private renderedComponent: RenderedComponent<EditorType> | null = null;

  constructor(
    private EditorComponent: ComponentType<EditorType>,
    public column: ColumnDataSchemaModel,
    private save: (value: SaveData, preventFocus?: boolean) => void,
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
