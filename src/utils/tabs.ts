import browser from 'webextension-polyfill';

export async function getCurrentTab() {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  const tab = tabs[0];
  return { tabs, tab: tab };
}

function convertUrl(url?: string) {
  return !url ? 'none' : new URL(url).hostname;
}

export async function getCurrentTabDomain() {
  const { tab } = await getCurrentTab();

  return convertUrl(tab.url);
}
