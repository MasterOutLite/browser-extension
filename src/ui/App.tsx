import { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton, Stack, Typography } from '@mui/material';
import { FormSettings } from './components';

export enum ETabs {
  Main = 'main',
  PageSettings = 'pageSettings',
  GlobalSettings = 'globalSettings',
}

export function App() {
  const [tab, setTab] = useState(ETabs.Main);

  return (
    <Stack p={1}>
      <Stack direction='row' justifyContent='flex-end' gap='6px'>
        <Typography variant='h6'>Job Scraper</Typography>
        <IconButton>
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton>
          <ArrowForwardIosIcon />
        </IconButton>
      </Stack>

      <FormSettings />
    </Stack>
  );
}
