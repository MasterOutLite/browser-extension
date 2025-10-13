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
import { ETagType, IConfigData, ISelector } from '@types/index';
import { setStorageValueByKey } from '@utils/index';
import { useEffect } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useBrowserStore } from '../../store';

const defaultSelectors: ISelector[] = [
  {
    keyRelationToApi: 'url',
    keySelectorHtml: '',
    order: 0,
    isRequired: true,
    tagType: ETagType.Href,
  },
];

const defaultKeys = defaultSelectors.map((s) => s.keyRelationToApi);

export function CustomSelectorsFormSettings() {
  const { state, domain, loading, setValue } = useBrowserStore();
  const { register, handleSubmit, reset, control, formState, getValues } =
    useForm<IConfigData>({
      defaultValues: {
        selectors: {
          selectorsOptions: defaultSelectors,
        },
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'selectors.selectorsOptions',
  });

  const handleSubmitForm: SubmitHandler<IConfigData> = async (data, e) => {
    e?.preventDefault();

    await setValue(data);
  };

  const handleRemoveAllState = async () => {
    const newData = {
      selectors: {
        selectorsOptions: defaultSelectors,
      },
    };
    await setStorageValueByKey(domain, newData);
    reset(newData);
  };

  useEffect(() => {
    if (loading) return;
    const selectorsOptions = state.selectors?.selectorsOptions ?? [];

    const missingSelectors = defaultSelectors.filter(
      (defaultSel) =>
        !selectorsOptions.some(
          (v) => v.keyRelationToApi === defaultSel.keyRelationToApi
        )
    );

    const updatedSelectors = [...selectorsOptions, ...missingSelectors];

    const newConfig = {
      ...state,
      selectors: {
        ...state.selectors,
        selectorsOptions: updatedSelectors,
      },
    };

    reset(newConfig);
  }, [state]);

  const sortedSelectors = [...fields].sort((a, b) => {
    const aIsDefault = defaultKeys.includes(a.keyRelationToApi);
    const bIsDefault = defaultKeys.includes(b.keyRelationToApi);
    if (aIsDefault && !bIsDefault) return -1;
    if (!aIsDefault && bIsDefault) return 1;
    return (a.order ?? 0) - (b.order ?? 0);
  });

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
              tagType: ETagType.Text,
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
        {sortedSelectors.map((field) => {
          const index = fields.indexOf(field);
          return (
            <Stack key={field.id} borderBottom='1px solid #000'>
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
                  {...register(`selectors.selectorsOptions.${index}.order`, {
                    valueAsNumber: true,
                    min: 1,
                  })}
                  variant='standard'
                  label='Order'
                  fullWidth
                />

                <IconButton
                  onClick={() => remove(index)}
                  disabled={defaultKeys.includes(field.keyRelationToApi)}
                >
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

                {/* <Controller
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
                /> */}
              </Stack>
            </Stack>
          );
        })}

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
    </Stack>
  );
}
function watch(arg0: string) {
  throw new Error('Function not implemented.');
}
