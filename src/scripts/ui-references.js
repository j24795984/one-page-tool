export const referenceFilterGroups = [
  { key: 'styles', label: '風格' },
  { key: 'features', label: '特色' },
];

export function filterReferences(items, selections, query = '') {
  const keyword = query.trim().toLocaleLowerCase('zh-TW');
  return items.filter(item => referenceFilterGroups.every(({ key }) =>
    !selections[key]?.length || selections[key].some(value => item[key].includes(value))
  ) && [item.title, item.domain, item.summary,
    ...item.styles, ...item.features, ...item.keywords,
  ].join(' ').toLocaleLowerCase('zh-TW').includes(keyword));
}
