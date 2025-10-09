import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  getCurrentTab,
  getDomainConfig,
  getDomainOptions,
  setStorageValueByKey,
} from '@utils/index';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IConfigSelector } from 'types/index';

export function SelectorFormSettings() {
  const { register, handleSubmit, reset, control, formState } =
    useForm<IConfigSelector>({
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
    await setStorageValueByKey(domain, {
      selectors,
    });
    reset(selectors);
  };

  async function getDate() {
    const tab = await getCurrentTab();

    if (!tab.url) return;

    const domain = new URL(tab.url).hostname;

    const config = await getDomainConfig(domain);
    const selectors = getDomainOptions(domain, config.selectors || {});

    reset(selectors);
  }

  useEffect(() => {
    getDate();
  }, []);

  return (
    <Stack component='form' gap='6px' onSubmit={handleSubmit(handleSubmitForm)}>
      <TextField
        variant='standard'
        label='Card Selector'
        {...register('cardSelector')}
      />

      <TextField
        variant='standard'
        label='Name Selector'
        {...register('nameSelector')}
      />

      <TextField
        variant='standard'
        label='Company Selector'
        {...register('companySelector')}
      />

      <TextField
        variant='standard'
        label='Ref Selector'
        {...register('refSelector')}
      />

      <TextField
        variant='standard'
        label='Date Selector'
        {...register('dateSelector')}
      />

      <Stack>
        <Typography variant='subtitle1'>External Id</Typography>
        <Controller
          name='externalId.fromLink'
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              labelPlacement='end'
              label='From link'
            />
          )}
        />

        <Controller
          name='externalId.urlPathName'
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              labelPlacement='end'
              label='From url pathName'
            />
          )}
        />

        <TextField
          variant='standard'
          label='From url query params'
          {...register('externalId.urlQueryParams')}
        />
      </Stack>

      <Button variant='contained' type='submit' disabled={!formState.isDirty}>
        Save
      </Button>
    </Stack>
  );
}
