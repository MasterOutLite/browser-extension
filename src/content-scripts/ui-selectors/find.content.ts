import { IConfigSelector } from 'types/index';
import { IApiList, IListElement, IListElementBase } from '../types';
import { extractUniqueValue } from '../utils';

export function findContent(config: IConfigSelector) {
  const { cardSelector, nameSelector, refSelector } = config;
  const foundCards: IApiList[] = [];
  const foundCardsElement: IListElement[] = [];

  const cardListEl = document.querySelectorAll(cardSelector);

  cardListEl.forEach((card) => {
    const nameEl = card.querySelector(nameSelector);
    const refEl = card.querySelector<HTMLAnchorElement>(refSelector);

    const baseData: IListElementBase = {
      name: {
        el: nameEl,
        value: nameEl?.textContent?.trim() || '',
      },
      ref: {
        value: refEl?.href || '',
        el: refEl,
      },
    };

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
      foundCards.push({ name: data.name.value, ref: data.ref.value });
    }
  });

  return { foundCards, foundCardsElement };
}
