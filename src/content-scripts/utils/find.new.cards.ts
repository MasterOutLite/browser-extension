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
  const url = new URL(value.ref.value);

  if (config.externalId?.fromLink) {
    if (config.externalId?.urlPathName) {
      const cleanUrl = `${url.protocol}//${url.host}${url.pathname}`;

      return {
        uniqueValue: cleanUrl,
        isDefault: !cleanUrl,
      };
    }

    if (
      config.externalId?.urlQueryParams?.length &&
      config.externalId?.urlQueryParams?.length > 0
    ) {
      const params = new URLSearchParams(url.search);

      const uniqueValue = config.externalId.urlQueryParams
        .map((key) => ({ key, value: params.get(key) }))
        .filter(({ value }) => value !== null)
        .map(({ key, value }) => `${key}:${value}`)
        .join('');

      return {
        uniqueValue,
        isDefault: !uniqueValue,
      };
    }

    const uniqueValue = value.ref.el?.getAttribute('id');

    return {
      uniqueValue: uniqueValue || defaultUniqueValue,
      isDefault: !uniqueValue,
    };
  }

  return { uniqueValue: defaultUniqueValue, isDefault: true };
}
