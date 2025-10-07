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

export function formatElementListToApiList(list: IListElement[]): IApiList[] {
  return list.map(formatElementToApi);
}

export function formatElementToApi(list: IListElement): IApiList {
  return {
    name: list.name.value,
    ref: list.ref.value,
    companyName: list.companyName.value,
    date: list.date?.value,
  };
}

export function formatElementForSave(v: IListElement): IStoredList {
  return {
    name: v.name.value,
    ref: v.ref.value,
    uniqueValue: v.uniqueValue,
    companyName: v.companyName.value,
  };
}
