import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TasksTable from '../../elements/tables/TasksTable';
import API from '../../../api';

export default function PanelLayout() {
  const [tasks, setTasks] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const result = await API.get(`/task`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTasks(result.data);
      setLoading(false);
    };
    getData();
  }, []);

  return (
    !loading && (
      <Stack sx={{ gap: '32px', m: '64px auto', maxWidth: 'var(--max-width)' }}>
        <TasksTable rows={tasks} />
      </Stack>
    )
  );
}
