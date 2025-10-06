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
  keyReadedData: string;
  externalId?: {
    fromLink?: boolean;
  };
}
