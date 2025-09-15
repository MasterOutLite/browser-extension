import { EMessageType } from '../background';
import { IConfigData } from '../utils';
import { damainOptions } from './constant';
import { IStoredList } from './types';
import { findContent } from './ui-selectors';
import {
  findNewCards,
  formatElementListToList,
  formatListToInit,
  isValidUrl,
  sendNotification,
  sendSetActiveTab,
  sleep,
  StatusOperation,
} from './utils';

const config = damainOptions['pl.indeed.com'];
const { keyReadedData } = config;

// const urlMacros: string =
//   'https://script.google.com/macros/s/AKfycbxSJaHMfgwdr2P5QGAIzTgFeA2BaQjApWR1AMKFceCLPjVBnRjTMBAjYaGGQEHtuXO5/exec';

async function worker(
  urlMacros: string = ''
): Promise<{ status: StatusOperation; subStatus?: StatusOperation }> {
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
    if (!savedData[0]?.uniqueValue) localStorage.removeItem(keyReadedData);
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
      init: formatListToInit(formatElementListToList(newCards)),
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

let isRunning: boolean = false;
async function startWorker() {
  const domain = window.location.hostname;

  const storageData = await chrome.storage.local.get('domains');
  const domains = storageData.domains || {};
  const {
    scraperRunning,
    pandingTime = 15000,
    urlMacros,
  }: IConfigData = domains[domain] || {};

  // console.log({ domain, storageData, data: domains[domain] });

  if (!scraperRunning || isRunning) return;

  if (!pandingTime || !isValidUrl(urlMacros)) {
    alert(`Bad data: pandingTime:${pandingTime}; urlMacros:${urlMacros} `);
    return;
  }

  isRunning = true;
  try {
    await sleep(pandingTime);
    const res = await worker(urlMacros);

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
      setTimeout(startWorker, pandingTime);
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
  isRunning = false;
}

document.addEventListener('start-job-scraper', async function () {
  startWorker();
});

startWorker();
