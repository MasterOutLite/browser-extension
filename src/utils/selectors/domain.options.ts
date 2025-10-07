import { IConfigSelector } from 'types/index';

export const domainOptions: Record<string, IConfigSelector> = {
  'indeed.com': {
    cardSelector: 'ul > li',
    nameSelector: 'span[id^="jobTitle-"]',
    refSelector: 'a[id^="job_"]',
    dateSelector: '',
    externalId: {
      fromLink: true,
      urlQueryParams: ['jk'],
    },
  },
};

export const domainOptionsKeys = Object.keys(domainOptions);
