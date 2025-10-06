import { Button, Input, Stack, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IConfigData } from '../../../types';
import {
  getCurrentTab,
  getDomainConfig,
  setDomainConfig,
} from '../../../utils';

export interface IFormSettingsProps {}

export function FormSettings({}: IFormSettingsProps) {
  const { register, handleSubmit, reset } = useForm<IConfigData>({
    defaultValues: {
      pandingTime: 15,
      urlMacros: '',
    },
  });

  const handleSubmitForm = async (
    data: IConfigData,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    const tab = await getCurrentTab();

    if (!tab.url) return;
    const domain = new URL(tab.url).hostname;

    console.log({ data, domain });

    await setDomainConfig(domain, data);
  };

  async function getDate() {
    const tab = await getCurrentTab();

    if (!tab.url) return;

    const domain = new URL(tab.url).hostname;
    const config = await getDomainConfig(domain);

    console.log({ config, domain });

    reset(config);
  }

  useEffect(() => {
    getDate();
  }, []);

  return (
    <Stack component='form' gap='6px' onSubmit={handleSubmit(handleSubmitForm)}>
      {/* // Change to global */}
      <TextField
        variant='standard'
        type='text'
        placeholder='Url macros'
        {...register('urlMacros')}
      />

      <TextField
        variant='standard'
        placeholder='Seconds'
        {...register('pandingTime', { valueAsNumber: true })}
      />

      <Button variant='contained' type='submit'>
        Save
      </Button>
    </Stack>
  );
}
