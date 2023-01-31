import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import AppButton from '../../../components/elements/buttons/AppButton';

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { state } = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeEmail = e => {
    setEmail(e.target.value);
  };

  const handleChangePassword = e => {
    setPassword(e.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    login(data.get('email'), data.get('password')).then(() => {
      const endpoint =
        localStorage.getItem('role') === 'admin' ? '/panel' : '/home';
      navigate(state?.path || endpoint);
    });
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
                  color: '#25222C',
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
                  color: 'rgba(37, 34, 44, 0.5)',
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
            <AppButton
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2, p: 1.7 }}>
              Войти
            </AppButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
