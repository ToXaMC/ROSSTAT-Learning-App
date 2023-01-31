import { Stack } from '@mui/system';
import React, { useState } from 'react';
import BaseModal from '../BaseModal';
import { styled } from '@mui/material/styles';
import {
  CardMedia,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material';
import AppButton from '../../buttons/AppButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import API from '../../../../api';

const Title = styled(Typography)({
  fontFamily: 'inherit',
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '22px',
  color: '#000',
});

export default function AddTaskModal({ open, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [points, setPoints] = useState(0);
  const [answers, setAnswers] = useState([{ title: '', is_correct: false }]);

  const handleChangeTitle = e => {
    setTitle(e.target.value);
  };

  const handleChangeDescription = e => {
    setDescription(e.target.value);
  };

  const handleChangeImage = e => {
    setImage(e.target.value);
  };

  const handleChangePoints = e => {
    setPoints(e.target.value);
  };

  const handleAddClick = e => {
    e.preventDefault();
    setAnswers([...answers, { title: '', is_correct: false }]);
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

  const handleChangeAnswerCheckbox = e => {
    setAnswers(
      answers.map((answer, index) =>
        index === parseInt(e.target.id)
          ? { ...answer, is_correct: e.target.checked }
          : answer
      )
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    const createTask = async () => {
      const taskData = {
        title,
        description,
        image,
        points,
        answers,
      };
      await API.post(`/task`, taskData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
    };
    createTask();

    setTitle('');
    setDescription('');
    setPoints(0);
    setAnswers([{ title: '', is_correct: false }]);
    setImage('');

    onClose();
  };

  return (
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
          <Title>Количество баллов</Title>
          <TextField
            type='number'
            variant='outlined'
            value={points}
            onChange={handleChangePoints}
            sx={{
              '& input': {
                fontFamily: 'var(--primary-font)',
              },
            }}
          />
        </Stack>
        <Stack sx={{ gap: '10px' }}>
          <Title>Варианты ответов</Title>
          <Stack sx={{ gap: '20px' }}>
            {answers.map((answer, index) => (
              <AnswerInput
                key={index}
                id={index.toString()}
                value={answer.title}
                onChange={handleChangeAnswer}
                onCheck={handleChangeAnswerCheckbox}
              />
            ))}
          </Stack>
          <Stack direction='row' justifyContent='center'>
            <AppButton
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddClick}
              sx={{
                mt: 2,
                width: '120px',
                height: '40px',

                '& .MuiButton-startIcon': {
                  margin: 0,
                },
              }}
            />
          </Stack>
        </Stack>
        <AppButton
          type='submit'
          sx={{ width: '172px', p: 1.5, alignSelf: 'center', mt: 4 }}>
          Создать
        </AppButton>
      </Stack>
    </BaseModal>
  );
}

function AnswerInput({ onCheck, id, ...props }) {
  const [title, setTitle] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const handleChange = e => {
    setTitle(e.target.value);
  };

  const handleChangeCorrect = e => {
    setIsCorrect(e.target.checked);
  };

  return (
    <Stack direction='row' alignItems='center' sx={{ gap: '24px' }}>
      <FormGroup>
        <FormControlLabel
          checked={isCorrect}
          control={<Checkbox id={id} />}
          label='Правильный'
          onChange={e => {
            handleChangeCorrect(e);
            onCheck(e);
          }}
        />
      </FormGroup>
      <TextField
        value={title}
        onChange={handleChange}
        placeholder='Вариант ответа'
        variant='outlined'
        fullWidth
        sx={{
          '& input': {
            fontFamily: 'var(--primary-font)',
          },
        }}
        id={id}
        {...props}
      />
    </Stack>
  );
}
