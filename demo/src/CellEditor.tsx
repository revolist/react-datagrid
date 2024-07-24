import { forwardRef, useEffect } from 'react';
import type { EditorType } from '@revolist/react-datagrid';

/**
 * Custom editor component
 */
export const ButtonEditor = forwardRef(({ close, column }: EditorType, ref) => {
  useEffect(() => {
    console.log('Editor did mount');
  });

  return <button onClick={() => close()}>Close {column.value}</button>;
});

