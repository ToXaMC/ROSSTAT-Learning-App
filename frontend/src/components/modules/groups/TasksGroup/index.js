import { Stack } from '@mui/system';
import React from 'react';
import TaskCard from '../../../elements/cards/TaskCard';

export default function TasksGroup({ tasks }) {
  return (
    <Stack
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '32px',
      }}>
      {tasks.map(task => (
        <TaskCard key={task.guid} task={task} />
      ))}
    </Stack>
  );
}
