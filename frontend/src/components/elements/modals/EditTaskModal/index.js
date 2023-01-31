import { Stack } from '@mui/system';
import React, { useContext, useState, useEffect } from 'react';
import BaseModal from '../BaseModal';
import { styled } from '@mui/material/styles';
import { CardMedia, TextField, Typography } from '@mui/material';
import AppButton from '../../buttons/AppButton';
import { MainContext } from '../../../../context/MainContextProvider';
import API from '../../../../api';

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
  color: '#3E3E41',
});

export default function EditTaskModal({ open, onClose }) {
  const { selectedTask } = useContext(MainContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    selectedTask && setLoading(false);
    selectedTask && setTitle(selectedTask.title);
    selectedTask && setDescription(selectedTask.description);
    selectedTask && setImage(selectedTask.image);
    selectedTask && setAnswers(selectedTask.answers);
  }, [selectedTask]);

  const handleChangeTitle = e => {
    setTitle(e.target.value);
  };

  const handleChangeDescription = e => {
    setDescription(e.target.value);
  };

  const handleChangeImage = e => {
    setImage(e.target.value);
  };

  const handleChangeAnswer = e => {
    setAnswers(
      answers.map((answer, index) =>
        index === parseInt(e.target.id)
          ? { ...answer, title: e.target.value }
          : answer
      )
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    const patchTask = async () => {
      console.log(answers);
      const taskData = {
        title,
        description,
        image,
        answers,
      };
      await API.patch(`/task/${selectedTask.guid}`, taskData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
    };
    patchTask();

    onClose();
  };

  return (
    !loading && (
      <BaseModal open={open} onClose={onClose}>
        <Stack component='form' onSubmit={handleSubmit} sx={{ gap: '24px' }}>
          <Stack sx={{ gap: '10px' }}>
            <Title>Название</Title>
            <TextField
              variant='outlined'
              value={title}
              onChange={handleChangeTitle}
              sx={{
                '& input': {
                  fontFamily: 'var(--primary-font)',
                },
              }}
            />
          </Stack>
          <Stats>Автор: {selectedTask?.author?.email}</Stats>
          <Stack sx={{ gap: '10px' }}>
            <Title>Описание</Title>
            <TextField
              variant='outlined'
              value={description}
              onChange={handleChangeDescription}
              multiline
              rows={7}
              sx={{
                '& textarea': {
                  fontFamily: 'var(--primary-font)',
                },
              }}
            />
          </Stack>
          <Stack sx={{ gap: '10px' }}>
            <Title>Изображение</Title>
            <TextField
              variant='outlined'
              value={image}
              onChange={handleChangeImage}
              sx={{
                '& input': {
                  fontFamily: 'var(--primary-font)',
                },
              }}
            />
            <CardMedia
              component='img'
              height='300'
              sx={{ maxWidth: '400px', margin: '0 auto' }}
              image={image}
              alt='task'
            />
          </Stack>
          <Stack sx={{ gap: '10px' }}>
            <Title>Варианты ответов</Title>
            <Stack sx={{ gap: '20px' }}>
              {answers?.map((answer, index) => (
                <AnswerInput
                  key={index}
                  id={index.toString()}
                  value={answer.title}
                  onChange={handleChangeAnswer}
                />
              ))}
            </Stack>
          </Stack>
          <AppButton
            type='submit'
            sx={{ width: '172px', p: 1.5, alignSelf: 'center', mt: 4 }}>
            Сохранить
          </AppButton>
        </Stack>
      </BaseModal>
    )
  );
}

function AnswerInput({ ...props }) {
  const [name, setName] = useState('');

  const handleChange = e => {
    setName(e.target.name);
  };

  return (
    <TextField
      value={name}
      onChange={handleChange}
      placeholder='Вариант ответа'
      variant='outlined'
      sx={{
        '& input': {
          fontFamily: 'var(--primary-font)',
        },
      }}
      {...props}
    />
  );
}
