import { IConfigData } from '../../types';
import browser from 'webextension-polyfill';

export interface IStorageValue {
  clear?: boolean;
}

export async function getStorageValue<T extends Record<string, any>>(
  key: string
) {
  if (!browser?.storage?.local?.get)
    console.log('Empty browser setDomainConfig: ', browser);

  const value = await browser.storage.local.get(key);
  return value[key] as T;
}

export async function setStorageValue<T extends Record<string, any>>(
  domain: string,
  data: T,
  { clear }: IStorageValue = {}
): Promise<void> {
  const newValues = clear
    ? data
    : { ...data, ...(await getStorageValue(domain)) };

  await browser.storage.local.set({
    [domain]: newValues,
  });
}

export async function clearStorage() {
  await browser.storage.local.clear();
}

export async function setDomainConfig(
  domain: string,
  data: Partial<IConfigData>,
  options?: IStorageValue
): Promise<void> {
  await setStorageValue(domain, data, options);
}

export async function getDomainConfig(domain: string): Promise<IConfigData> {
  const values = await getStorageValue<IConfigData>(domain);
  return values || {};
}
