export interface IGlobalState
  extends Record<string, any>,
    Record<string, IConfigData> {
  urlMacros: string;
}

export interface IConfigData {
  scraperRunning: boolean;
  pandingTime: number;
  urlMacros?: string;
  selectors?: IConfigSelector;
}

export interface IConfigSelector {
  cardSelector: string;
  nameSelector: string;
  refSelector: string;
  companySelector: string;
  dateSelector?: string;
  externalId?: IExternalID;
  selectorsOptions?: ISelector[];
}

export interface ISelector {
  keySelectorHtml: string;
  keyRelationToApi: string;
  order: number;
  isRequired?: boolean;
  hasCheckForUnique?: boolean;
}

export interface IExternalID {
  fromLink?: boolean;
  urlPathName?: boolean;
  urlQueryParams?: string[];
}
