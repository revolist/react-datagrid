# Component content templates

Call `useTemplates()` in a component beneath the providers to inherit. Create
stable definitions with `useMemo` and render one `RevoTemplateOutlet` before the
products using those definitions. Portals preserve normal React Context.

```tsx
import { useTemplates, RevoTemplateOutlet } from '@revolist/react-datagrid';

const templates = useTemplates();
const cardContent = useMemo(() => templates.template<MyCardContext>(MyCard), [templates]);
return <><RevoTemplateOutlet owner={templates} /><MyBoard cardContent={cardContent} /></>;
```

Components receive a `context` prop. Use `{ props: context => ({ item: context.card }) }`
to adapt existing props. Updates replace props; removed props are cleared. Owner
cleanup supports React StrictMode effect replay and Suspense hiding/reveal.
Synchronous template updates publish one shared snapshot in the next microtask. Offscreen components unmount;
keep durable state in application data. `dispose()` releases all portal entries.

Use Core `asCellTemplate(definition, { key: p => p.model.id })` for cells,
`masterRow.template` for master details, `customization.cardContent` for Kanban,
and `gantt.visuals.taskBarContent` for Gantt labels. Product interaction controls
remain outside the custom content. The legacy Gantt content hook takes precedence.
Exports retain the default product representation.

Existing `Template`, `Editor` and `EditorAdapter` APIs are unchanged. These
new helpers require the Core build providing the component-template exports;
release Core before publishing consuming integrations.
