import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, IconButton, Stack, TextField } from '@mui/material';
import { clearStorage, getStorageValue, setStorageValue } from '@utils/index';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IGlobalState } from 'types/config.data';

export function GlobalSettings() {
  const { register, handleSubmit, reset, formState } = useForm<IGlobalState>({
    defaultValues: {
      urlMacros: '',
    },
  });

  const handleSubmitForm: SubmitHandler<IGlobalState> = async (data, e) => {
    e?.preventDefault();
    await setStorageValue(data);
    reset(data);
  };

  const handleRemoveAllState = async () => {
    clearStorage();
  };

  async function getDate() {
    const urlMacros = await getStorageValue<string>('urlMacros');

    reset(urlMacros);
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
