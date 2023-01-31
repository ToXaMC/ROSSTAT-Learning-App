import {
  CardMedia,
  Divider,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import AppButton from '../../elements/buttons/AppButton';
import API from '../../../api';
import AnswerModal from '../../elements/modals/AnswerModal';

const Title = styled(Typography)({
  fontFamily: 'inherit',
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '22px',
  color: '#000',
});

const Stats = styled(Typography)({
  fontFamily: 'inherit',
  fontWeight: 500,
  fontSize: '18px',
  lineHeight: '22px',
});

const Text = styled(Typography)({
  fontFamily: 'inherit',
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '18px',
});

export default function TaskLayout() {
  const [value, setValue] = React.useState('');
  const [task, setTask] = useState();
  const [loading, setLoading] = useState(true);
  const [correctAnswerId, setCorrectAnswerId] = React.useState('');
  const [isCorrectlySolved, setIsCorrectlySolved] = useState(false);

  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);

  const handleCloseAnswerModal = () => setIsAnswerModalOpen(false);

  useEffect(() => {
    const getData = async () => {
      const result = await API.get(`/task/${localStorage.getItem('taskId')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTask(result.data);
      setLoading(false);
      setCorrectAnswerId(
        result.data.answers.find(answer => answer.is_correct === true).guid
      );
    };
    getData();
  }, []);

  const handleChange = e => {
    setValue(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (value === correctAnswerId) {
      console.log('correct');
      setIsCorrectlySolved(true);

      API.post(`/task/solve/${localStorage.getItem('taskId')}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
    } else {
      console.log('wrong');
      setIsCorrectlySolved(false);
    }

    setIsAnswerModalOpen(true);
  };

  return (
    !loading && (
      <>
        <Stack
          sx={{
            gap: '32px',
            m: '64px auto',
            maxWidth: 'var(--max-width)',
          }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              boxShadow: '0px 4px 20px rgba(83, 83, 83, 0.1)',
              borderRadius: '16px',
              display: 'grid',
              gap: '24px',
            }}>
            <Title>{task.title}</Title>
            <Stats>Автор: {task?.author?.email}</Stats>
            <Stack sx={{ gap: '10px' }}>
              <Title>Описание</Title>
              <Text>{task.description}</Text>
            </Stack>
            <CardMedia
              component='img'
              height='300'
              sx={{ maxWidth: '400px', margin: '0 auto' }}
              image={task.image}
              alt='task'
            />
            <Stack
              component='form'
              onSubmit={handleSubmit}
              sx={{ gap: '24px' }}>
              <Stack>
                <Title sx={{ marginBottom: '10px' }}>Ответ</Title>
                <Divider />
                <FormControl>
                  <RadioGroup
                    name='answers'
                    value={value}
                    onChange={handleChange}>
                    {task?.answers?.map((answer, index) => (
                      <FormControlLabel
                        key={index}
                        value={answer.guid}
                        control={<Radio />}
                        label={answer.title}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Stack>
              <AppButton
                type='submit'
                sx={{ width: '200px', margin: '0 auto' }}>
                Отправить
              </AppButton>
            </Stack>
          </Paper>
        </Stack>

        <AnswerModal
          open={isAnswerModalOpen}
          onClose={handleCloseAnswerModal}
          isCorrectlySolved={isCorrectlySolved}
          points={task?.points}
        />
      </>
    )
  );
}
