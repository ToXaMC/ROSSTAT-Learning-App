import React from 'react';
import { Link } from 'react-router-dom';
import { Button, IconButton } from '@mui/material';
import MireaLogo from '../../../elements/icons/MireaLogo';
import styles from './Header.module.scss';
import { Stack } from '@mui/system';
import PersonIcon from '@mui/icons-material/Person';
import ProfileMenu from '../../../elements/menus/ProfileMenu';

export default function Header({ logo, exit }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const isAdmin = localStorage.getItem('role') === 'admin';

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className={styles.header}>
      <Stack
        direction='row'
        sx={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Stack direction='row' sx={{ gap: '32px' }}>
          {logo && (
            <div className={styles.logoContainer}>
              <Link
                to='/home'
                style={{ width: 'fit-content', justifySelf: 'center' }}>
                <MireaLogo />
              </Link>
            </div>
          )}
          <Stack direction='row' sx={{ gap: '32px', alignItems: 'center' }}>
            <Link to='/home' style={{ height: 'fit-content' }}>
              <Button
                sx={{
                  textTransform: 'none',
                  color: 'var(--color-primary)',
                }}>
                Задачи
              </Button>
            </Link>
            {isAdmin && (
              <Link to='/panel' style={{ height: 'fit-content' }}>
                <Button
                  sx={{
                    textTransform: 'none',
                    color: 'var(--color-primary)',
                  }}>
                  Панель
                </Button>
              </Link>
            )}
          </Stack>
        </Stack>
        <IconButton
          onClick={handleClick}
          sx={{ width: 'fit-content', height: 'fit-content' }}>
          <PersonIcon />
        </IconButton>
      </Stack>
      <ProfileMenu anchorEl={anchorEl} open={open} handleClose={handleClose} />
    </header>
  );
}
