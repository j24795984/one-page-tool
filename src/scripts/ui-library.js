export const filterGroups = [
  { key: 'types', label: '類型' },
  { key: 'triggers', label: '觸發方式' },
  { key: 'packages', label: '技術' }
];
export function filterItems(items, selections, query = '') {
  const keyword = query.trim().toLocaleLowerCase('zh-TW');
  return items.filter(item => filterGroups.every(({key}) => !selections[key].length || selections[key].some(value => item[key].includes(value))) && [item.title, item.summary, ...item.effects, ...item.triggers, ...item.types, ...item.packages].join(' ').toLocaleLowerCase('zh-TW').includes(keyword));
}

export const triggerOrder = ['自動播放', '進入可視區', '捲動連動', 'hover', '點擊', '長按', '拖曳'];
