import browser from 'webextension-polyfill';

const pandingTime = 5000;
const cardSelector = '#mosaic-provider-jobcards > ul > li';
const nameSelector = 'span[id^="jobTitle-"]';
const refSelector = 'a[id^="job_"]';
const keyReadedData = 'ReadedData';
const urlMacros: string =
  'https://script.google.com/macros/s/AKfycbxSJaHMfgwdr2P5QGAIzTgFeA2BaQjApWR1AMKFceCLPjVBnRjTMBAjYaGGQEHtuXO5/exec';

interface IReturnList {
  name: string;
  ref: string;
}

function readData(
  cardSelector: string,
  nameSelector: string,
  refSelector: string
) {
  const returnList: IReturnList[] = [];

  const cardListEl = document.querySelectorAll(cardSelector);

  // console.log('cardListEl: ', cardListEl);

  cardListEl.forEach((card) => {
    const nameEl = card.querySelector(nameSelector);
    const refEl = card.querySelector<HTMLAnchorElement>(refSelector);

    const data: IReturnList = {
      name: nameEl?.textContent?.trim() || '',
      ref: refEl?.href || '',
    };

    if (Boolean(data.name) || Boolean(data.ref)) returnList.push(data);
  });

  // console.log('returnList: ', returnList);
  return returnList;
}

function getNewItemsByNameAndRef(
  readedDates: IReturnList[],
  savedDate: IReturnList[]
): IReturnList[] {
  const savedKeys = new Set(savedDate.map((d) => `${d.name}|${d.ref}`));

  return readedDates.filter((d) => !savedKeys.has(`${d.name}|${d.ref}`));
}

function sendDataToTable(data: IReturnList[]): RequestInit {
  const body = {
    data,
  };

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

async function worker() {
  const readedDates = readData(cardSelector, nameSelector, refSelector);

  // отримання даних із стореджа
  const savedDateString = localStorage.getItem(keyReadedData);
  let savedDate: IReturnList[] = [];

  try {
    savedDate = savedDateString ? JSON.parse(savedDateString) : [];
    savedDate = Array.isArray(savedDate) ? savedDate : [];
  } catch {}

  // пошук нових даних
  const newData = getNewItemsByNameAndRef(readedDates, savedDate);
  // console.log('Нові дані: ', newData);

  // обєднання списку для майбутньої перевірки

  const newDataForSave = Array.from(new Set([...savedDate, ...readedDates]));

  // console.log('newDataForSave: ', newData);

  // Надсилаємо дані у background script

  if (Boolean(newData.length)) {
    const response = await browser.runtime.sendMessage(browser.runtime.id, {
      url: urlMacros,
      init: sendDataToTable(newData) as RequestInit,
    });
    console.log('Дані додані', response);
    if (response?.success) {
      console.log('Дані додані', response.result);
      localStorage.setItem(keyReadedData, JSON.stringify(newDataForSave));
      location.reload();
    } else {
      console.error('Помилка надсилання даних', response.error);
    }
  } else {
    location.reload();
  }
}

let isRuning: any = null;
async function startWorker() {
  console.log('startWorker: ');

  const { scraperRunning } = await browser.storage.local.get('scraperRunning');
  if (scraperRunning && !isRuning) {
    console.log('Автозапуск Job scraper після перезавантаження');
    isRuning = setInterval(worker, pandingTime);
  } else if (!scraperRunning && isRuning) {
    clearInterval(isRuning);
  }
}

document.addEventListener('start-job-scraper', async function () {
  await browser.storage.local.set({ scraperRunning: true });
  startWorker();
});

startWorker();
