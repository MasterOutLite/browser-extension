import { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PublicIcon from '@mui/icons-material/Public';
import HomeIcon from '@mui/icons-material/Home';
import { Icon, IconButton, Stack, Typography } from '@mui/material';
import { Action, FormSettings } from './components';

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

export function App() {
  const [tab, setTab] = useState<ILocalRoute>(localRoutes[0]);

  return (
    <Stack p={1}>
      <Stack
        direction='row'
        justifyContent='flex-end'
        alignItems='center'
        gap='6px'
      >
        <Typography variant='h6'>Job Scraper</Typography>
        <IconButton
          onClick={() => {
            const index = localRoutes.indexOf(tab);
            const setIndex = index - 1 < 0 ? localRoutes.length - 1 : index - 1;
            const newTab = localRoutes[setIndex];
            console.log('Preview: ', { newTab, index: setIndex });
            setTab(newTab);
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <Icon>{tab.icon}</Icon>
        <IconButton
          onClick={() => {
            const index = localRoutes.indexOf(tab);
            const setIndex = index + 1 >= localRoutes.length ? 0 : index + 1;
            const newTab = localRoutes[setIndex];
            console.log('Next: ', { newTab, setIndex });
            setTab(newTab);
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Stack>

      {tab.value === ETabs.Main && <FormSettings />}

      <Action />
    </Stack>
  );
}
