import { IConfigData } from '../types';

export async function setDomainConfig(
  domain: string,
  data: Partial<IConfigData>
): Promise<void> {
  const storageData = await chrome.storage.local.get('domains');
  const domains = storageData.domains || {};

  const domainsData = domains[domain];

  domains[domain] = { ...domainsData, ...data };
  await chrome.storage.local.set({ domains });
}

export async function getDomainConfig(domain: string): Promise<IConfigData> {
  const storageData = await chrome.storage.local.get('domains');
  const domains = storageData.domains || {};

  return domains[domain] || {};
}
