import { IConfigData } from '../types';
import browser from 'webextension-polyfill';

export async function setDomainConfig(
  domain: string,
  data: Partial<IConfigData>
): Promise<void> {
  if (!browser?.storage?.local?.get)
    console.log('Empty browser setDomainConfig: ', browser);
  const storageData = await browser.storage.local.get('domains');
  const domains = storageData.domains || {};

  const domainsData = domains[domain];

  domains[domain] = { ...domainsData, ...data };
  await browser.storage.local.set({ domains });
}

export async function getDomainConfig(domain: string): Promise<IConfigData> {
  if (!browser?.storage?.local?.get)
    console.log('Empty browser getDomainConfig: ', browser);

  const storageData = await browser.storage.local.get('domains');
  const domains = storageData.domains || {};

  return domains[domain] || {};
}
