import test from 'node:test';
import assert from 'node:assert/strict';
import { filterItems, filterGroups } from '../src/scripts/ui-library.js';

const items = [
  { id: 'text', title: 'Text Fade', summary: '文字進場', effects: ['淡入'], triggers: ['進入可視區'], types: ['文字'], packages: ['GSAP'] },
  { id: 'image', title: 'Parallax', summary: '圖片視差', effects: ['視差', '捲動連動'], triggers: ['捲動連動'], types: ['圖片'], packages: ['GSAP'] },
  { id: 'scrollbar', title: 'Scrollbar', summary: '自訂捲軸', effects: ['捲動連動', '拖曳'], triggers: ['捲動連動', '拖曳'], types: ['版面'], packages: ['原生 JS'] }
];
const selection = overrides => ({ triggers: [], types: [], packages: [], ...overrides });
const ids = result => result.map(item => item.id);

test('no selections returns the complete catalog', () => {
  assert.deepEqual(ids(filterItems(items, selection())), ['text', 'image', 'scrollbar']);
});
test('multiple triggers use OR, with no duplicate cards', () => {
  assert.deepEqual(ids(filterItems(items, selection({ triggers: ['拖曳', '捲動連動'] }))), ['image', 'scrollbar']);
});
test('different filter groups use AND', () => {
  assert.deepEqual(ids(filterItems(items, selection({ triggers: ['進入可視區', '捲動連動'], types: ['圖片'], packages: ['GSAP'] }))), ['image']);
});
test('keyword search combines with selected filters and ignores case and outer whitespace', () => {
  assert.deepEqual(ids(filterItems(items, selection({ packages: ['GSAP'] }), '  TEXT  ')), ['text']);
  assert.deepEqual(ids(filterItems(items, selection({ triggers: ['進入可視區'] }), '視差')), []);
});
test('search includes descriptions and technology labels', () => {
  assert.deepEqual(ids(filterItems(items, selection(), '文字進場')), ['text']);
  assert.deepEqual(ids(filterItems(items, selection(), '原生 JS')), ['scrollbar']);
});


test('effects remain searchable while filters use triggers', () => {
  assert.deepEqual(filterGroups.map(group => group.key), ['types', 'triggers', 'styles', 'packages']);
  assert.deepEqual(ids(filterItems(items, selection(), '視差')), ['image']);
  assert.deepEqual(ids(filterItems(items, selection(), '進入可視區')), ['text']);
});
test('single-valued styles allow multi-select OR and cross-group AND', () => {
  const styled = items.map((item, i) => ({ ...item, style: ['精緻', '俏皮', '無分類'][i] }));
  assert.deepEqual(ids(filterItems(styled, selection({ styles: ['俏皮', '無分類'] }))), ['image', 'scrollbar']);
  assert.deepEqual(ids(filterItems(styled, selection({ styles: ['俏皮', '無分類'], packages: ['GSAP'] }))), ['image']);
  assert.deepEqual(ids(filterItems(styled, selection({ styles: ['無分類'] }))), ['scrollbar']);
  assert.deepEqual(ids(filterItems(styled, selection(), '可愛')), ['image']);
});
test('documents without triggers remain visible until a trigger is selected', () => {
  const docs = [{ ...items[0], id: 'document', triggers: [] }];
  assert.deepEqual(ids(filterItems(docs, selection())), ['document']);
  assert.deepEqual(filterItems(docs, selection({ triggers: ['點擊'] })), []);
});
