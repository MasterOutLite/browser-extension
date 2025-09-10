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

  cardListEl.forEach((card) => {
    const nameEl = card.querySelector(nameSelector);
    const refEl = card.querySelector<HTMLAnchorElement>(refSelector);

    const data: IReturnList = {
      name: nameEl?.textContent?.trim() || '',
      ref: refEl?.href || '',
    };

    if (Boolean(data.name) || Boolean(data.ref)) returnList.push(data);
  });

  return returnList;
}

function getNewItemsByNameAndRef(
  readedDates: IReturnList[],
  savedDate: IReturnList[]
): IReturnList[] {
  const formatKey = (v: IReturnList) => `${v.name}`;

  const savedKeys = new Set(savedDate.map(formatKey));

  return readedDates.filter((d) => !savedKeys.has(formatKey(d)));
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

  // обєднання списку для майбутньої перевірки
  const combined = [...savedDate, ...readedDates];
  const newDataForSave = Array.from(
    new Map(combined.map((item) => [item.name, item])).values()
  );

  // Надсилаємо дані у background script
  if (Boolean(newData.length)) {
    const response = await chrome.runtime.sendMessage({
      url: urlMacros,
      init: sendDataToTable(newData) as RequestInit,
    });

    if (response?.success) {
      localStorage.setItem(keyReadedData, JSON.stringify(newDataForSave));
      location.reload();
      console.log(' location.reload');
    } else {
      console.error('Помилка надсилання даних', response.error);
    }
  } else {
    location.reload();
    console.log(' location.reload not find newData');
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let isRunning: boolean = false;
async function startWorker() {
  const domain = window.location.hostname;
  const storageData = await chrome.storage.local.get('domains');
  const domains = storageData.domains || {};
  const scraperRunning = domains[domain]?.scraperRunning;

  console.log({ domain, storageData, scraperRunning });

  if (!scraperRunning || isRunning) return;

  isRunning = true;
  try {
    await sleep(pandingTime);
    await worker();
  } finally {
    isRunning = false;
    // setTimeout(startWorker, pandingTime);
  }
}

document.addEventListener('start-job-scraper', async function () {
  startWorker();
});

startWorker();
