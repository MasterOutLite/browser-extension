import { IApiList, IListElement, IStoredList } from '../types';

export function formatListToInit(data: IApiList[]): RequestInit {
  const body = {
    data,
  };

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

export function formatElementListToList(list: IListElement[]): IApiList[] {
  return list.map((v) => ({ name: v.name.value, ref: v.ref.value }));
}

export function formatElementForSave(v: IListElement): IStoredList {
  return {
    name: v.name.value,
    ref: v.ref.value,
    uniqueValue: v.uniqueValue,
  };
}
