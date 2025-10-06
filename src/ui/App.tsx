import { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PublicIcon from '@mui/icons-material/Public';
import HomeIcon from '@mui/icons-material/Home';
import { Icon, IconButton, Stack, Typography } from '@mui/material';
import {
  Action,
  FormSettings,
  GlobalSettings,
  SelectorFormSettings,
} from './components';

export enum ETabs {
  Main = 'main',
  PageSettings = 'pageSettings',
  GlobalSettings = 'globalSettings',
}

export interface ILocalRoute {
  value: ETabs;
  icon: React.ReactNode;
}

const localRoutes: ILocalRoute[] = [
  { value: ETabs.Main, icon: <HomeIcon /> },
  { value: ETabs.PageSettings, icon: <NewspaperIcon /> },
  { value: ETabs.GlobalSettings, icon: <PublicIcon /> },
];

const initRoute = localRoutes.find((v) => v.value === ETabs.Main)!;

export function App() {
  const [tab, setTab] = useState<ILocalRoute>(initRoute);

  const handleNext = () => {
    const index = localRoutes.indexOf(tab);
    const setIndex = index - 1 < 0 ? localRoutes.length - 1 : index - 1;
    const newTab = localRoutes[setIndex];

    setTab(newTab);
  };

  const handlePreviues = () => {
    const index = localRoutes.indexOf(tab);
    const setIndex = index + 1 >= localRoutes.length ? 0 : index + 1;
    const newTab = localRoutes[setIndex];

    setTab(newTab);
  };

  return (
    <Stack p={1}>
      <Stack
        direction='row'
        justifyContent='flex-end'
        alignItems='center'
        gap='6px'
      >
        <Typography variant='h6'>Job Scraper</Typography>
        <IconButton onClick={handleNext}>
          <ArrowBackIosIcon />
        </IconButton>
        <Icon>{tab.icon}</Icon>
        <IconButton onClick={handlePreviues}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Stack>

      {tab.value === ETabs.Main && <FormSettings />}
      {tab.value === ETabs.PageSettings && <SelectorFormSettings />}
      {tab.value === ETabs.GlobalSettings && <GlobalSettings />}

      <Action />
    </Stack>
  );
}
