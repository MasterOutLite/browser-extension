import browser from 'webextension-polyfill';

let interval: any = null;

document.getElementById('start-worker')?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (interval) return;

  interval = true;
  // Інжектуємо файл index.js
  await browser.tabs.executeScript({
    file: 'index.js',
  });

  console.log('Invoke job-scraper');
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const event = new Event('start-job-scraper');
      document.dispatchEvent(event);
      console.log('Start event: ', event);
    },
  });
});

document.getElementById('stop-worker')?.addEventListener('click', async () => {
  await browser.storage.local.set({ scraperRunning: false });
});

document.getElementById('close-window')?.addEventListener('click', () => {
  window.close();
});
