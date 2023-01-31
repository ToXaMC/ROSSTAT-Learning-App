import React from 'react';
import { Stack } from '@mui/system';
import TabButton from '../../buttons/TabButton';
import RecordBookTable from '../../tables/RecordBookTable';

export default function RecordBookTabs() {
  return (
    <Stack sx={{ gap: '32px', m: '0 auto' }}>
      <Stack direction='row' sx={{ gap: '32px', m: '0 auto' }}>
        <TabButton>1 семестр</TabButton>
        <TabButton>2 семестр</TabButton>
        <TabButton>3 семестр</TabButton>
      </Stack>
      <RecordBookTable />
    </Stack>
  );
}
