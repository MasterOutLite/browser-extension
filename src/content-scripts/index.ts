import { EMessageType, IConfigSelector } from '../types';
import {
  ELocalStorageKey,
  getDomainConfig,
  getStorageValueByKey,
  isValidUrl,
  sleep,
} from '../utils';

import { IStoredList } from './types';
import { findContent } from './ui-selectors';
import {
  findNewCards,
  formatElementListToApiList,
  formatListToInit,
  sendNotification,
  sendSetActiveTab,
  StatusOperation,
} from './utils';

// const config = domainOptions['pl.indeed.com'];
const keyReadedData = ELocalStorageKey.SavedCard;

const getDomain = () => window.location.hostname;

async function worker(
  urlMacros: string = ''
): Promise<{ status: StatusOperation; subStatus?: StatusOperation }> {
  const domain = getDomain();
  const { selectors, scraperRunning } = await getDomainConfig(domain);
  if (!scraperRunning) return { status: StatusOperation.NONE };
  const config: IConfigSelector = selectors || ({} as IConfigSelector);
  const { cardSelector, companySelector, nameSelector, refSelector } = config;

  const checkSelectors = [
    cardSelector,
    companySelector,
    nameSelector,
    refSelector,
  ];

  if (!checkSelectors.every((v) => Boolean(v))) {
    console.log('Config selectors is bad: ', checkSelectors);
    return { status: StatusOperation.CONFIG_SELECTOR_ERROR };
  }

  const { foundCards, foundCardsElement } = findContent(config);

  if (Boolean(!foundCards?.length)) {
    return { status: StatusOperation.NOT_FOUND_CARDS };
  }

  // отримання даних із стореджа
  const savedDateString = localStorage.getItem(keyReadedData);
  let savedData: IStoredList[] = [];

  try {
    savedData = savedDateString ? JSON.parse(savedDateString) : [];
    savedData = Array.isArray(savedData) ? savedData : [];
    if (!savedData[0]?.uniqueValue) {
      localStorage.removeItem(keyReadedData);
      savedData = [];
    }
  } catch {}

  const { newCards, newCardsForSave } = findNewCards(
    savedData,
    foundCardsElement,
    config
  );

  // Надсилаємо дані у background script
  const hasNewData = Boolean(newCards.length);
  if (hasNewData) {
    const response = await chrome.runtime.sendMessage({
      url: urlMacros,
      init: formatListToInit(formatElementListToApiList(newCards)),
      type: EMessageType.REQUEST,
    });

    if (response?.success) {
      localStorage.setItem(keyReadedData, JSON.stringify(newCardsForSave));
      console.log(' location.reload');
    } else {
      console.error('Помилка надсилання даних', response.error);
      return { status: StatusOperation.FETCH_SAVE_ERROR };
    }
  } else {
    console.log(' location.reload not find newData');
  }

  return {
    status: StatusOperation.OK,
    subStatus: hasNewData ? StatusOperation.SEND_CARDS : StatusOperation.NONE,
  };
}

async function startWorker() {
  const domain = getDomain();
  const {
    scraperRunning,
    pandingTime = 15,
    urlMacros: domainUrlMacros,
  } = await getDomainConfig(domain);
  const globalUrlMacros = await getStorageValueByKey<string>('urlMacros');
  const normalizeTime = pandingTime * 1000;

  const urlMacros = domainUrlMacros || globalUrlMacros;

  if (!scraperRunning || (window as any).isRunning) return;
  (window as any).isRunning = true;

  if (!pandingTime || !isValidUrl(urlMacros)) {
    alert(
      `Bad data: pandingTime:${pandingTime}| ${normalizeTime}; urlMacros:${urlMacros} `
    );
    (window as any).isRunning = false;
    return;
  }

  try {
    await sleep(normalizeTime);
    const res = await worker(urlMacros);
    console.log('Result worker: ', res);

    if (res.status === StatusOperation.OK) {
      res.subStatus === StatusOperation.SEND_CARDS &&
        (await sendNotification({
          title: `Send new data: ${document.title}.`,
          message: `${domain}: Saved new Cards.`,
          requireInteraction: true,
        }));

      location.reload();
      return;
    }
    if ([StatusOperation.FETCH_SAVE_ERROR].includes(res.status)) {
      setTimeout(startWorker, normalizeTime);
    }

    if (res.status === StatusOperation.NOT_FOUND_CARDS) {
      await sendNotification({
        title: `ERROR: ${document.title}`,
        message: `${domain}: Not found cards`,
        requireInteraction: true,
      });
      await sendSetActiveTab();
      await sleep(2000);
      alert(`Cart not found!`);
    }
  } finally {
  }
  (window as any).isRunning = false;
}

if (!(window as any).__scraperInjected) {
  (window as any).__scraperInjected = true;
  console.log('Script no located');
}

document.addEventListener('start-job-scraper', async function () {
  startWorker();
});

startWorker();
