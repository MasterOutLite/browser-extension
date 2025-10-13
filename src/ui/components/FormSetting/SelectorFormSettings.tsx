import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { IConfigSelector } from '@types/index';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useBrowserStore } from '../../store';
import { getDomainOptions } from '@utils/index';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';

export function SelectorFormSettings() {
  const { state, domain, loading, setValue } = useBrowserStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue: setValueForm,

    control,
    formState,
  } = useForm<IConfigSelector>({
    defaultValues: {},
  });

  const handleSubmitForm: SubmitHandler<IConfigSelector> = async (
    selectors,
    e
  ) => {
    e?.preventDefault();
    await setValue({ selectors });
    reset(selectors);
  };

  const handleSetDefault = () => {
    const defaultSelectors = getDomainOptions(domain);
    Object.entries(defaultSelectors).forEach(([key, value]) => {
      setValueForm(key as keyof IConfigSelector, value, { shouldDirty: true });
    });
  };

  useEffect(() => {
    if (loading) return;

    console.log('Reset new val');

    reset(state?.selectors);
  }, [state]);

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

      <Stack direction='row' gap={2}>
        <Button
          variant='contained'
          type='submit'
          fullWidth
          disabled={!formState.isDirty}
        >
          Save
        </Button>
        <IconButton color='warning' onClick={handleSetDefault}>
          <RotateLeftIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}
