import { Button, Stack, TextField } from '@mui/material';
import {
  getCurrentTab,
  getDomainConfig,
  setStorageValueByKey,
} from '@utils/index';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IConfigSelector } from 'types/index';

export function SelectorFormSettings() {
  const { register, handleSubmit, reset } = useForm<IConfigSelector>({
    defaultValues: {},
  });

  const handleSubmitForm: SubmitHandler<IConfigSelector> = async (
    selectors,
    e
  ) => {
    e?.preventDefault();
    const tab = await getCurrentTab();

    if (!tab.url) return;
    const domain = new URL(tab.url).hostname;

    setStorageValueByKey(domain, { selectors });
  };

  async function getDate() {
    const tab = await getCurrentTab();

    if (!tab.url) return;

    const domain = new URL(tab.url).hostname;
    const config = await getDomainConfig(domain);

    reset(config.selectors);
  }

  useEffect(() => {
    getDate();
  }, []);

  return (
    <Stack component='form' gap='6px' onSubmit={handleSubmit(handleSubmitForm)}>
      <TextField
        variant='standard'
        placeholder='Card Selector'
        {...register('cardSelector')}
      />

      <TextField
        variant='standard'
        placeholder='Name Selector'
        {...register('nameSelector')}
      />

      <TextField
        variant='standard'
        placeholder='Ref Selector'
        {...register('refSelector')}
      />

      <Button variant='contained' type='submit'>
        Save
      </Button>
    </Stack>
  );
}
