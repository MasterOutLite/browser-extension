import { IConfigSelector } from '@types/index';
import { domainOptions, domainOptionsKeys } from './domain.options';

export function getMainDomain(domain: string): string {
  return domain.split('.').slice(-2).join('.');
}

export function getDomainOptions(
  domain: string,
  extendOptions: Partial<IConfigSelector>
): IConfigSelector {
  const mainDomain = getMainDomain(domain);

  const optionsKey = domainOptionsKeys.find((v) => v.endsWith(mainDomain));

  const defaultOptions: IConfigSelector = optionsKey
    ? domainOptions[optionsKey]
    : {
        cardSelector: '',
        nameSelector: '',
        refSelector: '',
        dateSelector: '',
        companySelector: '',
        externalId: { fromLink: false },
      };

  return { ...defaultOptions, ...extendOptions };
}
