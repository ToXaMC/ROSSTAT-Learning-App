import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import TabButton from '../../elements/buttons/TabButton';
import TasksGroup from '../../modules/groups/TasksGroup';
import API from '../../../api';

export default function HomeLayout() {
  const [tasks, setTasks] = useState([]);
  const [realTasks, setRealTasks] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { id: 0, title: 'Все задачи' },
    { id: 1, title: 'Активные' },
    { id: 2, title: 'Завершенные' },
  ];
  useEffect(() => {
    const getData = async () => {
      const result = await API.get(`/task`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTasks(result.data);
      setRealTasks(result.data);
    };
    getData();
  }, []);

  const handleClick = event => {
    const index = parseInt(event.target.id);
    setActiveTab(index);
    if (index === 0) {
      const filteredTasks = tasks.filter(
        task => task.is_active === true || task.is_active === false
      );
      setRealTasks(filteredTasks);
    } else if (index === 1) {
      const filteredTasks = tasks.filter(task => task.is_active === true);
      setRealTasks(filteredTasks);
    } else if (index === 2) {
      const filteredTasks = tasks.filter(task => task.is_active === false);
      setRealTasks(filteredTasks);
    }
  };

  return (
    <Stack sx={{ gap: '32px', m: '64px auto', maxWidth: 'var(--max-width)' }}>
      <Stack direction='row' sx={{ gap: '32px', m: '0 auto' }}>
        {tabs.map((tab, index) => (
          <TabButton
            key={index}
            id={index}
            onClick={handleClick}
            active={activeTab === index}>
            {tab.title}
          </TabButton>
        ))}
      </Stack>
      <TasksGroup tasks={realTasks} />
    </Stack>
  );
}
