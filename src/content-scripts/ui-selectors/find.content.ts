import { IConfigSelector } from 'types/index';
import { IApiList, IListElement, IListElementBase } from '../types';
import { extractUniqueValue, formatElementToApi } from '../utils';

export function findContent(config: IConfigSelector) {
  const {
    cardSelector,
    nameSelector,
    refSelector,
    companySelector,
    dateSelector,
  } = config;
  const foundCards: IApiList[] = [];
  const foundCardsElement: IListElement[] = [];

  const cardListEl = document.querySelectorAll(cardSelector);

  cardListEl.forEach((card) => {
    const nameEl = card.querySelector(nameSelector);
    const refEl = card.querySelector<HTMLAnchorElement>(refSelector);
    const companyEl = card.querySelector(companySelector);
    const dateEl = dateSelector ? card.querySelector(dateSelector) : null;

    const baseData: IListElementBase = {
      name: {
        el: nameEl,
        value: nameEl?.textContent?.trim() || '',
      },
      ref: {
        value: refEl?.href || '',
        el: refEl,
      },
      companyName: {
        value: companyEl?.textContent?.trim() || '',
        el: companyEl,
      },
    };

    if (dateEl) {
      baseData.date = {
        value: dateEl?.textContent?.trim() || '',
        el: dateEl,
      };
    }

    const { uniqueValue, isDefault } = extractUniqueValue(baseData, config);

    const data = {
      ...baseData,
      uniqueValue,
    };

    if (isDefault && config.externalId?.fromLink) {
      return;
    }

    if (Boolean(data.name.value) || Boolean(data.ref.value)) {
      foundCardsElement.push(data);
      foundCards.push(formatElementToApi(data));
    }
  });

  return { foundCards, foundCardsElement };
}
