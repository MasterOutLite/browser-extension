import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, IconButton, Stack, TextField } from '@mui/material';
import {
  getCurrentTab,
  getDomainConfig,
  setDomainConfig,
  setStorageValueByKey,
} from '@utils/index';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import browser from 'webextension-polyfill';
import { IConfigData } from '../../../types';

export interface IFormSettingsProps {}

export function FormSettings({}: IFormSettingsProps) {
  const { register, handleSubmit, reset, formState } = useForm<IConfigData>({
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
    reset(data);
  };

  const handleRemoveAllState = async () => {
    const tab = await getCurrentTab();

    if (!tab.url) return;
    const domain = new URL(tab.url).hostname;
    setStorageValueByKey(domain, {}, { clear: true });
  };

  async function getDate() {
    const tab = await getCurrentTab();

    if (!tab.url) return;

    const domain = new URL(tab.url).hostname;
    const config = await getDomainConfig(domain);

    reset(config);
  }

  async function handleRemoveLocalStorage() {
    const tab = await getCurrentTab();

    if (!tab.url) return;

    await browser.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        window.localStorage.clear();
      },
    });
  }

  useEffect(() => {
    getDate();
  }, []);

  return (
    <Stack component='form' gap='6px' onSubmit={handleSubmit(handleSubmitForm)}>
      <TextField
        variant='standard'
        type='text'
        label='Url macros'
        {...register('urlMacros')}
      />

      <TextField
        variant='standard'
        label='Seconds'
        {...register('pandingTime', { valueAsNumber: true })}
      />

      <Button
        variant='contained'
        type='submit'
        fullWidth
        onClick={handleRemoveLocalStorage}
      >
        Remove local state
      </Button>
      <Stack direction='row' gap={1}>
        <Button
          variant='contained'
          type='submit'
          fullWidth
          disabled={!formState.isDirty}
        >
          Save
        </Button>
        <IconButton onClick={handleRemoveAllState}>
          <DeleteForeverIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}
