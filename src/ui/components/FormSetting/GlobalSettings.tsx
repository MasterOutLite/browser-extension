import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, IconButton, Stack, TextField } from '@mui/material';
import { clearStorage } from '@utils/storage';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IGlobalState } from 'types/config.data';

export function GlobalSettings() {
  const { register, handleSubmit } = useForm<IGlobalState>({
    defaultValues: {
      pandingTime: 15,
    },
  });

  const handleSubmitForm: SubmitHandler<IGlobalState> = () => {};

  const handleRemoveAllState = async () => {
    clearStorage();
  };

  return (
    <Stack component='form' gap='6px' onSubmit={handleSubmit(handleSubmitForm)}>
      <TextField
        variant='standard'
        type='text'
        placeholder='Url macros'
        {...register('urlMacros')}
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
