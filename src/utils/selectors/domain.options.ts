import { IConfigSelector } from 'types/index';

export const domainOptions: Record<string, IConfigSelector> = {
  'indeed.com': {
    cardSelector: 'ul > li',
    nameSelector: 'span[id^="jobTitle-"]',
    refSelector: 'a[id^="job_"]',
    dateSelector: '',
    keyReadedData: 'ReadedData',
    externalId: { fromLink: true },
  },
};

export const domainOptionsKeys = Object.keys(domainOptions);
