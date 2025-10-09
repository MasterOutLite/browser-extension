import { IConfigSelector } from 'types/index';

export const domainOptions: Record<string, IConfigSelector> = {
  'indeed.com': {
    cardSelector: 'ul > li',
    nameSelector: 'span[id^="jobTitle-"]',
    refSelector: 'a[id^="job_"]',
    companySelector: '',
    dateSelector: '',
    externalId: {
      fromLink: true,
      urlQueryParams: ['jk'],
    },
  },
  'dou.ua': {
    cardSelector: 'ul[class="lt"]  > li',
    nameSelector: 'a[class="vt"]',
    refSelector: 'a[class="vt"]',
    companySelector: 'a[class="company"]',
    dateSelector: 'div[class="date"]',
    externalId: {
      fromLink: true,
      urlPathName: true,
    },
  },
  'djinni.co': {
    cardSelector: 'ul > li[id^="job-item-"]',
    nameSelector: 'h2 > a',
    refSelector: 'h2 > a',
    companySelector: 'a[data-analytics="company_page"]',
    dateSelector: 'span[data-original-title]',
    externalId: {
      fromLink: true,
      urlPathName: true,
    },
  },
};

export const domainOptionsKeys = Object.keys(domainOptions);
