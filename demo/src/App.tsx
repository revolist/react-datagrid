import {
  RevoGrid,
  Template,
  Editor,
  type Editors,
  ColumnRegular,
} from '@revolist/react-datagrid';
import './App.css';
import { Cell } from './CellRenderer';
import { Header } from './HeaderRenderer';
import { ButtonEditor } from './CellEditor';


function App() {
  // Custom editor name
  const MY_EDITOR = 'custom-editor';
  const columns: ColumnRegular[] = [
    {
      prop: 'name',
      name: 'First',
      // Use custom editor
      editor: MY_EDITOR,
      columnTemplate: Template(Header),
      cellTemplate: Template(Cell),
    },
    {
      prop: 'details',
      name: 'Second',
    },
  ];
  const source = [
    {
      name: '1',
      details: 'Item 1',
    },
    {
      name: '2',
      details: 'Item 2',
    },
  ];
  // Register custom editor
  const gridEditors: Editors = { [MY_EDITOR]: Editor(ButtonEditor) };
  return (
    <>
      <RevoGrid columns={columns} source={source} editors={gridEditors} />
    </>
  );
}

export default App;
