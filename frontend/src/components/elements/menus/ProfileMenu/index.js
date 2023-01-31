import React, { useState, useEffect } from 'react';
import { Menu, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { styled } from '@mui/material/styles';
import AppButton from '../../buttons/AppButton';
import { useLocation, useNavigate } from 'react-router';
import useAuth from '../../../../hooks/useAuth';
import API from '../../../../api';

const Title = styled(Typography)({
  fontFamily: 'inherit',
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '26px',
  color: '#3E3E41',
  marginBottom: '20px',
});

const Point = styled(Typography)({
  fontFamily: 'inherit',
  fontWeight: 500,
  fontSize: '18px',
  lineHeight: '22px',
  color: '#A6A8B5',
});

const Data = styled(Typography)({
  fontFamily: 'inherit',
  fontWeight: 500,
  fontSize: '18px',
  lineHeight: '22px',
  color: '#3E3E41',
});

export default function ProfileMenu({ anchorEl, open, handleClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { state } = useLocation();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const result = await API.get(`/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setUser(result.data);
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout().then(() => {
      navigate(state?.path || '/');
    });
  };

  return (
    <Menu
      anchorEl={anchorEl}
      id='account-menu'
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          p: 4,
          maxWidth: '390px',
          borderRadius: '12px',
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
      <Title>Мой профиль</Title>
      <Stack sx={{ gap: '10px' }}>
        <Stack sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
          <Point>Имя</Point>
          <Data>
            {user.last_name} {user.first_name} {user.middle_name}
          </Data>
        </Stack>
        <Stack sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
          <Point>Почта</Point>
          <Data>{user.email}</Data>
        </Stack>
        <Stack sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
          <Point>Баллы</Point>
          <Data>{user.points}</Data>
        </Stack>
      </Stack>
      <AppButton onClick={handleLogout} sx={{ p: 1.5, marginTop: '30px' }}>
        Выйти из системы
      </AppButton>
    </Menu>
  );
}
