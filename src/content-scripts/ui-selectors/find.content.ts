import { IConfigSelector } from '../constant';
import { IList, IListElement } from '../types';

export function findContent({
  cardSelector,
  nameSelector,
  refSelector,
  externalId,
}: IConfigSelector) {
  const returnList: IList[] = [];
  const returnListElement: IListElement[] = [];

  const cardListEl = document.querySelectorAll(cardSelector);

  cardListEl.forEach((card) => {
    const nameEl = card.querySelector(nameSelector);
    const refEl = card.querySelector<HTMLAnchorElement>(refSelector);

    const data: IListElement = {
      name: {
        el: nameEl,
        value: nameEl?.textContent?.trim() || '',
      },
      ref: {
        value: refEl?.href || '',
        el: refEl,
      },
    };

    if (Boolean(data.name.value) || Boolean(data.ref.value)) {
      returnListElement.push(data);
      returnList.push({ name: data.name.value, ref: data.ref.value });
    }
  });

  return { returnList, returnListElement };
}
