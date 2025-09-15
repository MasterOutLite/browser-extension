import { IConfigSelector } from '../constant';
import { IListElement, IStoredList } from '../types';

export function findNewCards(
  savedList: IStoredList[],
  currentList: IListElement[],
  config: IConfigSelector
) {
  return currentList.filter((cur) => {
    if (config.externalId?.fromLink) {
      const curentUniqueValue = cur.ref.el?.getAttribute('id');
      const foundItem = savedList.find(
        (v) => (v.uniqueValue || v.name) === curentUniqueValue
      );

      return !Boolean(foundItem);
    }

    const foundItem = savedList.find(
      (v) => (v.uniqueValue || v.name) === cur.name.value
    );

    return !Boolean(foundItem);
  });
}
