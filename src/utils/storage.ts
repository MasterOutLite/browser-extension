export async function setDomainConfig(
  domain: string,
  data: Record<string, any>
): Promise<void> {
  const storageData = await chrome.storage.local.get('domains');
  const domains = storageData.domains || {};

  const domainsData = domains[domain];

  domains[domain] = { ...domainsData, ...data };
  await chrome.storage.local.set({ domains });
}

export async function getDomainConfig(
  domain: string
): Promise<Record<string, any>> {
  const storageData = await chrome.storage.local.get('domains');
  const domains = storageData.domains || {};

  return domains[domain] || {};
}
