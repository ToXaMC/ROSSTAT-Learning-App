import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/system';
import { Typography } from '@mui/material';
import AppButton from '../../../components/elements/buttons/AppButton';
import API from '../../../api';

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');

  const handleChangeEmail = e => {
    setEmail(e.target.value);
  };

  const handleChangePassword = e => {
    setPassword(e.target.value);
  };

  const handleChangeFirstName = e => {
    setFirstName(e.target.value);
  };

  const handleChangeLastName = e => {
    setLastName(e.target.value);
  };

  const handleChangeMiddleName = e => {
    setMiddleName(e.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const data = {
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName,
    };
    const registerUser = async () => {
      const result = await API.post(`/signup`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (result.status === 200) {
        navigate('/');
      }
    };
    registerUser();
  };

  return (
    <Box
      component='main'
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <Box>
          <Stack
            direction='row'
            sx={{ gap: '32px', justifyContent: 'center', mb: '32px' }}>
            <Link to='/'>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '26px',
                  color: 'rgba(37, 34, 44, 0.5)',
                }}>
                Вход
              </Typography>
            </Link>
            <Link to='/register'>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '26px',

                  color: '#25222C',
                }}>
                Регистрация
              </Typography>
            </Link>
          </Stack>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ maxWidth: '394px' }}>
            <TextField
              value={email}
              onChange={handleChangeEmail}
              margin='normal'
              required
              fullWidth
              id='email'
              label='Почта'
              name='email'
              autoComplete='email'
              autoFocus
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '12px',
                },
              }}
            />
            <TextField
              value={password}
              onChange={handleChangePassword}
              margin='normal'
              required
              fullWidth
              name='password'
              label='Пароль'
              type='password'
              id='password'
              autoComplete='current-password'
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '12px',
                },
              }}
            />
            <TextField
              value={firstName}
              onChange={handleChangeFirstName}
              margin='normal'
              required
              fullWidth
              name='first_name'
              label='Имя'
              type='text'
              id='first_name'
              autoComplete='current-password'
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '12px',
                },
              }}
            />
            <TextField
              value={lastName}
              onChange={handleChangeLastName}
              margin='normal'
              required
              fullWidth
              name='second_name'
              label='Фамилия'
              type='text'
              id='second_name'
              autoComplete='current-password'
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '12px',
                },
              }}
            />
            <TextField
              value={middleName}
              onChange={handleChangeMiddleName}
              margin='normal'
              required
              fullWidth
              name='middle_name'
              label='Отчество'
              type='text'
              id='middle_name'
              autoComplete='current-password'
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '12px',
                },
              }}
            />
            <AppButton
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2, p: 1.7 }}>
              Зарегистрироваться
            </AppButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
