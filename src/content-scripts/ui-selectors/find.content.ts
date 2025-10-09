import { ETagType, IConfigSelector, ISelector } from 'types/index';
import { IApiList, IListElement, IListElementBase } from '../types';
import { extractUniqueValue, formatElementToApi } from '../utils';

export function findContent(config: IConfigSelector) {
  const {
    cardSelector,
    nameSelector,
    refSelector,
    companySelector,
    dateSelector,
    selectorsOptions,
  } = config;
  const foundCards: IApiList[] = [];
  const foundCardsElement: IListElement[] = [];

  const cardListEl = document.querySelectorAll(cardSelector);

  cardListEl.forEach((card) => {
    const nameEl = card.querySelector(nameSelector);
    const refEl = card.querySelector<HTMLAnchorElement>(refSelector);
    const companyEl = card.querySelector(companySelector);
    const dateEl = dateSelector ? card.querySelector(dateSelector) : null;

    if ([nameEl, refEl, companyEl].some((v) => !Boolean(v))) return;

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

    console.log('Check extractUniqueValue:', { uniqueValue, isDefault });

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

function findValuesByCustomSelector(
  elements: NodeListOf<Element>,
  options: ISelector[]
) {
  elements.entries().map(([_, card]) => {
    options.map((config) => {
      const {
        keyRelationToApi,
        keySelectorHtml,
        order,
        hasCheckForUnique,
        isRequired,
        tagType,
      } = config;

      if ([keySelectorHtml, keyRelationToApi, order].some((v) => !Boolean(v))) {
        return null;
      }
      const element = card.querySelector(keySelectorHtml);

      let value: string | undefined | null = '';

      switch (tagType) {
        case ETagType.Href:
          value = element?.getAttribute('href');
          break;
        default:
          value = element?.textContent;
          break;
      }

      value = value || '';

      return { value, element, config };
    });
    return;
  });
}
