import { useState } from 'react';
import type { ColumnDataSchemaModel } from '@revolist/react-datagrid';

/**
 * Custom cell component
 */
export const Cell = ({ model, prop, value }: ColumnDataSchemaModel) => {
  const [isRed, setIsRed] = useState(false);
  
  return (
    <div 
      onClick={() => setIsRed(true)}
      style={{ backgroundColor: isRed ? 'red' : 'transparent' }}
    >
      <strong title={prop?.toString()} data-value-from-model={model[prop]}>{value}</strong>
    </div>
  );
};
