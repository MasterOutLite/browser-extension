import { IConfigSelector } from 'types/index';
import { domainOptionsKeys } from './domain.options';

export function getDomainOptions(
  domain: string,
  extendOptions: Partial<IConfigSelector>
) {
  domainOptionsKeys.find((v) => v.endsWith(domain));
}
