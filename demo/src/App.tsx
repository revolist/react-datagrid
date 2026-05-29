import {
  RevoGrid,
  Template,
  Editor,
  type ColumnRegular,
  type Editors,
} from '@revolist/react-datagrid';
import './App.css';
import { Cell } from './CellRenderer';
import { ButtonEditor } from './CellEditor';

const MY_EDITOR = 'custom-editor';
const COLUMN_COUNT = 100;
const ROW_COUNT = 10_000;
const CELL_TEMPLATE = Template(Cell);

const columnProps = Array.from(
  { length: COLUMN_COUNT },
  (_, index) => `column_${index + 1}`,
);

const columns: ColumnRegular[] = columnProps.map((prop, index) => ({
  prop,
  name: `Column ${index + 1}`,
  size: 150,
  cellTemplate: CELL_TEMPLATE,
  ...(index === 0 ? { editor: MY_EDITOR } : {}),
}));

const source = Array.from({ length: ROW_COUNT }, (_, rowIndex) => {
  const row: Record<string, string> = {};

  for (const [columnIndex, prop] of columnProps.entries()) {
    row[prop] = `R${rowIndex + 1} C${columnIndex + 1}`;
  }

  return row;
});

const gridEditors: Editors = { [MY_EDITOR]: Editor(ButtonEditor) };

function App() {
  return (
    <>
      <RevoGrid columns={columns} source={source} editors={gridEditors} />
    </>
  );
}

export default App;
