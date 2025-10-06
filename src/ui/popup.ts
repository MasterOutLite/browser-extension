import { setDomainConfig } from '../utils';

document.getElementById('start-worker')?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab.url) return;

  // Інжектуємо файл index.js
  // chrome.scripting.executeScript({
  //   target: { tabId: tab.id! },
  //   files: ['src/content-scripts/index.js'],
  // });

  const domain = new URL(tab.url).hostname;

  await setDomainConfig(domain, { scraperRunning: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: () => {
      const event = new Event('start-job-scraper');
      document.dispatchEvent(event);
      console.log('Start event: ', event);
    },
  });
});

document.getElementById('stop-worker')?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab.url) return;

  const domain = new URL(tab.url).hostname;
  setDomainConfig(domain, { scraperRunning: false });
});

document.getElementById('close-window')?.addEventListener('click', () => {
  window.close();
});
