import { IConfigData } from '../../types';
import browser from 'webextension-polyfill';

export interface IStorageValue {
  clear?: boolean;
}

export async function getStorageValue<T extends any>(key?: string) {
  if (!browser?.storage?.local?.get)
    console.log('Empty browser setDomainConfig: ', browser);

  return (await browser.storage.local.get(key)) as Record<string, T>;
}

export async function getStorageValueByKey<T extends any>(key: string) {
  if (!browser?.storage?.local?.get)
    console.log('Empty browser setDomainConfig: ', browser);

  const value = await browser.storage.local.get(key);
  return value[key] as T;
}

export async function setStorageValue<T extends Record<string, any>>(
  data: T
): Promise<void> {
  return await browser.storage.local.set(data);
}

export async function setStorageValueByKey<T extends Record<string, any>>(
  key: string,
  data: T,
  { clear }: IStorageValue = {}
): Promise<void> {
  const newValues = clear
    ? data
    : { ...(await getStorageValueByKey<T>(key)), ...data };

  return await setStorageValue({
    [key]: newValues,
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
  await setStorageValueByKey(domain, data, options);
}

export async function getDomainConfig(domain: string): Promise<IConfigData> {
  const values = await getStorageValueByKey<IConfigData>(domain);
  return values || {};
}
