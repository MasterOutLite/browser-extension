export interface IConfigSelector {
  cardSelector: string;
  nameSelector: string;
  refSelector: string;
  keyReadedData: string;
  externalId?: {
    fromLink?: boolean;
  };
}

export const damainOptions: Record<string, IConfigSelector> = {
  'pl.indeed.com': {
    cardSelector: 'ul > li',
    nameSelector: 'span[id^="jobTitle-"]',
    refSelector: 'a[id^="job_"]',
    keyReadedData: 'ReadedData',
    externalId: { fromLink: true },
  },
};
