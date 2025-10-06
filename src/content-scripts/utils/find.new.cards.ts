import { IConfigSelector } from 'types/index';
import { IListElement, IListElementBase, IStoredList } from '../types';
import { formatElementForSave } from './format.data';

export function findNewCards(
  savedList: IStoredList[],
  currentList: IListElement[],
  config: IConfigSelector
) {
  const newCards = currentList.filter((cur) => {
    const { uniqueValue } = extractUniqueValue(cur, config);

    const foundItem = savedList.find(
      (v) => (v.uniqueValue || v.name) === uniqueValue
    );

    return !Boolean(foundItem);
  });

  const combined: IStoredList[] = [
    ...savedList,
    ...newCards.map(formatElementForSave),
  ];

  const newCardsForSave = Array.from(
    new Map(combined.map((item) => [item.uniqueValue, item])).values()
  );

  return { newCards, newCardsForSave };
}

export function extractUniqueValue(
  value: IListElementBase,
  config: IConfigSelector
) {
  const defaultUniqueValue = value.name.value;

  if (config.externalId?.fromLink) {
    const uniqueValue = value.ref.el?.getAttribute('id');

    return {
      uniqueValue: uniqueValue || defaultUniqueValue,
      isDefault: !Boolean(uniqueValue),
    };
  }

  return { uniqueValue: defaultUniqueValue, isDefault: true };
}
