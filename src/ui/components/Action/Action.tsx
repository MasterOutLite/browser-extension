import { Button, Stack } from '@mui/material';
import { getCurrentTab } from '@utils/tabs';
import browser from 'webextension-polyfill';
import { useBrowserStore } from '../../store';

export function Action() {
  const { state, loading, setValue } = useBrowserStore();

  const handleStartWorker = async () => {
    const { tab } = await getCurrentTab();

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

    await setValue({ scraperRunning: true });

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
    setValue({ scraperRunning: false });
  };

  const handleCloseWindow = () => {
    window.close();
  };

  if (loading) return null;
  return (
    <Stack direction='row' pt={2} gap={2}>
      {state?.scraperRunning ? (
        <Button variant='contained' onClick={handlStopWorker} fullWidth>
          Stop
        </Button>
      ) : (
        <Button variant='contained' onClick={handleStartWorker} fullWidth>
          Start
        </Button>
      )}
      <Button variant='contained' onClick={handleCloseWindow} fullWidth>
        Close
      </Button>
    </Stack>
  );
}
