import { IConfigData } from '@types/index';
import {
  getCurrentTabDomain,
  getDomainConfig,
  setDomainConfig,
} from '@utils/index';
import { useCallback, useEffect, useState } from 'react';
import browser from 'webextension-polyfill';

export interface IStore {
  state: IConfigData;
  domain: string;
}

export function useBrowserStore() {
  const [state, setState] = useState<IStore>({} as IStore);

  useEffect(() => {
    const get = async () => {
      const domain = await getCurrentTabDomain();

      const config = await getDomainConfig(domain);
      setState({ state: config, domain });
    };
    get();

    const listner = (
      changes: browser.Storage.StorageAreaOnChangedChangesType
    ) => {
      Object.entries(changes).forEach(([_, value]) => {
        setState((prev) => ({ ...prev, state: value.newValue as IConfigData }));
      });
    };

    browser.storage.local.onChanged.addListener(listner);

    return () => browser.storage.local.onChanged.removeListener(listner);
  }, []);

  const setValue = useCallback(
    async (value: Partial<IConfigData>) => {
      if (!state?.domain) return;

      await setDomainConfig(state?.domain, value);
    },
    [state?.domain]
  );

  return {
    ...state,
    loading: !Boolean(state?.domain),
    setValue,
  };
}
