import type { ColumnDataSchemaModel } from '@revolist/react-datagrid';

/**
 * Custom cell component
 */
export const Cell = ({ model, prop, value }: ColumnDataSchemaModel) => {
  return (
    <div>
      <strong title={prop?.toString()} data-value-from-model={model[prop]}>{value}</strong>
    </div>
  );
};
