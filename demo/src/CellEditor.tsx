import type { EditorType } from '@revolist/react-datagrid';

/**
 * Custom editor component
 */
export const ButtonEditor = ({ close, column }: EditorType) => {
  return <button onClick={() => close()}>Close {column.value}</button>;
};
