export interface IApiList {
  name: string;
  ref: string;
}

export interface IStoredList extends IApiList {
  uniqueValue: string;
}

export interface IListElementBase {
  name: {
    value: string;
    el?: Element | null;
  };
  ref: {
    value: string;
    el?: Element | null;
  };
  companyName: {
    value: string;
    el?: Element | null;
  };
  date?: {
    value: string;
    el?: Element | null;
  };
}

export interface IListElement extends IListElementBase {
  uniqueValue: string;
}
