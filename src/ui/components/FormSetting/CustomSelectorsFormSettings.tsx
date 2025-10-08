import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import {
  getCurrentTab,
  getDomainConfig,
  setDomainConfig,
  setStorageValueByKey,
} from '@utils/index';
import React, { useEffect } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { IConfigData } from 'types/config.data';

export function CustomSelectorsFormSettings() {
  const { register, handleSubmit, reset, control, getValues } =
    useForm<IConfigData>({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'selectors.selectorsOptions',
  });

  const handleSubmitForm: SubmitHandler<IConfigData> = async (data, e) => {
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
    setStorageValueByKey(domain, {}, { clear: true });
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
    <Stack gap='6px'>
      <Stack direction='row' justifyContent='flex-end'>
        <IconButton
          onClick={() => {
            const selectors = getValues('selectors.selectorsOptions') || [];

            const maxOrder = selectors.length
              ? Math.max(...selectors.map((s) => s.order ?? 0)) + 1
              : 0;

            append({
              keySelectorHtml: '',
              keyRelationToApi: '',
              order: maxOrder,
            });
          }}
        >
          <AddIcon />
        </IconButton>
      </Stack>

      <Stack
        component='form'
        gap='6px'
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        {fields.map((field, index) => (
          <Stack key={field.id}>
            <Stack direction='row' gap={1} alignItems='center'>
              <TextField
                {...register(
                  `selectors.selectorsOptions.${index}.keySelectorHtml`
                )}
                variant='standard'
                label='Selector HTML'
                fullWidth
              />
              <TextField
                {...register(
                  `selectors.selectorsOptions.${index}.keyRelationToApi`
                )}
                variant='standard'
                label='Key Api'
                fullWidth
              />
              <TextField
                {...register(`selectors.selectorsOptions.${index}.order`)}
                variant='standard'
                label='Order'
                fullWidth
              />

              <IconButton onClick={() => remove(index)}>
                <DeleteForeverIcon />
              </IconButton>
            </Stack>
            <Stack direction='row' gap={1} alignItems='center'>
              <Controller
                name={`selectors.selectorsOptions.${index}.isRequired`}
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    labelPlacement='end'
                    label='Required'
                  />
                )}
              />

              <Controller
                name={`selectors.selectorsOptions.${index}.hasCheckForUnique`}
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    labelPlacement='end'
                    label='Unique'
                  />
                )}
              />
            </Stack>
          </Stack>
        ))}

        <Stack direction='row' gap={1}>
          <Button variant='contained' type='submit' fullWidth>
            Save
          </Button>
          <IconButton onClick={handleRemoveAllState}>
            <DeleteForeverIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
}
