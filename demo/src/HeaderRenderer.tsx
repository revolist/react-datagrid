import type { ColumnTemplateProp } from '@revolist/react-datagrid';

/**
 * Custom header component
 */
export const Header = ({ prop }: ColumnTemplateProp) => {
  return (
    <div style={{ background: 'red', textAlign: 'center' }}>
      <strong title={prop?.toString()}>I am custom!</strong>
    </div>
  );
};
