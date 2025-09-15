import { IList } from '../types';

export function selectNewItemsByNameAndRef(
  readedDates: IList[],
  savedDate: IList[]
): IList[] {
  const formatKey = (v: IList) => `${v.name}`;

  const savedKeys = new Set(savedDate.map(formatKey));

  return readedDates.filter((d) => !savedKeys.has(formatKey(d)));
}
