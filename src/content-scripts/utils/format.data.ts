import { IList, IListElement } from '../types';

export function formatListToInit(data: IList[]): RequestInit {
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

export function formatElementListToList(list: IListElement[]): IList[] {
  return list.map((v) => ({ name: v.name.value, ref: v.ref.value }));
}
