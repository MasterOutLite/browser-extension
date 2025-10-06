import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, IconButton, Stack, TextField } from '@mui/material';
import {
  getCurrentTab,
  getDomainConfig,
  setDomainConfig,
  setStorageValue,
} from '@utils/index';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IConfigData } from '../../../types';

export interface IFormSettingsProps {}

export function FormSettings({}: IFormSettingsProps) {
  const { register, handleSubmit, reset } = useForm<IConfigData>({
    defaultValues: {
      pandingTime: 15,
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

    await setDomainConfig(domain, data);
  };

  const handleRemoveAllState = async () => {
    const tab = await getCurrentTab();

    if (!tab.url) return;
    const domain = new URL(tab.url).hostname;
    setStorageValue(domain, {}, { clear: true });
  };

  async function getDate() {
    const tab = await getCurrentTab();

    if (!tab.url) return;

    const domain = new URL(tab.url).hostname;
    const config = await getDomainConfig(domain);

    reset(config);
  }

  useEffect(() => {
    getDate();
  }, []);

  return (
    <Stack component='form' gap='6px' onSubmit={handleSubmit(handleSubmitForm)}>
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

      <Stack direction='row' gap={1}>
        <Button variant='contained' type='submit' fullWidth>
          Save
        </Button>
        <IconButton onClick={handleRemoveAllState}>
          <DeleteForeverIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}
