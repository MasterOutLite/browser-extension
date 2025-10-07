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
  dateSelector?: string;
  companySelector?: string;
  externalId?: IExternalID;
  selectors?: ISelector[];
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
