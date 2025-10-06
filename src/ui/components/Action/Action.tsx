import { Button, Stack } from '@mui/material';
import { setDomainConfig } from '@utils/storage';
import { getCurrentTab } from '@utils/tabs';
import browser from 'webextension-polyfill';

export function Action() {
  const handleStartWorker = async () => {
    const tab = await getCurrentTab();

    if (!tab.url) return;

    const alreadyInjected = await browser.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => !!(window as any).__scraperInjected,
    });

    if (!alreadyInjected[0].result) {
      // Інжектуємо файл index.js
      chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        files: ['src/content-scripts/index.js'],
      });
    }

    const domain = new URL(tab.url).hostname;
    await setDomainConfig(domain, { scraperRunning: true });

    browser.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        const event = new Event('start-job-scraper');
        document.dispatchEvent(event);
        console.log('Start event: ', event);
      },
    });
  };

  const handlStopWorker = async () => {
    const tab = await getCurrentTab();
    if (!tab.url) return;

    const domain = new URL(tab.url).hostname;
    setDomainConfig(domain, { scraperRunning: false });
  };

  const handleCloseWindow = () => {
    window.close();
  };

  return (
    <Stack direction='row' justifyContent='space-between' pt={2}>
      <Button variant='contained' onClick={handleStartWorker}>
        Start
      </Button>
      <Button variant='contained' onClick={handlStopWorker}>
        Stop
      </Button>
      <Button variant='contained' onClick={handleCloseWindow}>
        Close
      </Button>
    </Stack>
  );
}
