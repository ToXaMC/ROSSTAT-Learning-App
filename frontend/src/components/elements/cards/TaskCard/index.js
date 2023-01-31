import { CardMedia, Paper, Typography } from '@mui/material';
import React from 'react';
import AppButton from '../../buttons/AppButton';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/system';
import { Link } from 'react-router-dom';

const Theme = styled(Typography)({
  textTransform: 'uppercase',
  fontFamily: 'inherit',
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '18px',
  color: '#A6A8B5',
});

export default function TaskCard({ task }) {
  const handleClick = () => {
    localStorage.setItem('taskId', task.guid);
  };

  return (
    <Paper
      elevation={0}
      sx={{ borderRadius: '12px', border: '1px solid #D9DDE0' }}>
      <Stack sx={{ p: 2, marginBottom: '8px', gap: '16px' }}>
        <Theme>{task.title}</Theme>
        <Typography
          sx={{
            maxWidth: '240px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}>
          {task.description}
        </Typography>
      </Stack>
      <CardMedia
        component='img'
        height='160'
        // image='https://avatars.mds.yandex.net/i?id=57a501702ff9428ecb4d39b35dc50ddd5624f1b9-8191765-images-thumbs&n=13'
        image={task.image}
        alt='task'
      />
      <Stack
        direction='row'
        sx={{ p: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        {task.is_active && (
          <Link to='/task'>
            <AppButton onClick={handleClick}>Решить</AppButton>
          </Link>
        )}
        <Typography
          component='span'
          sx={{ color: 'var(--color-primary)', fontFamily: 'inherit' }}>
          +{task.points} баллов
        </Typography>
      </Stack>
    </Paper>
  );
}
