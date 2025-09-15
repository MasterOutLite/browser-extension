export interface IList {
  name: string;
  ref: string;
}

export interface IStoredList {
  name: string;
  ref: string;
  uniqueValue: string;
}

export interface IListElement {
  name: {
    value: string;
    el?: Element | null;
  };
  ref: {
    value: string;
    el?: Element | null;
  };
}
