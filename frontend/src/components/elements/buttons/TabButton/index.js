import { Button } from '@mui/material';
import React from 'react';

export default function TabButton({ children, onClick, active, ...props }) {
  return (
    <Button
      variant='outlined'
      onClick={onClick}
      sx={{
        p: '4px 16px',
        fontWeight: 500,
        fontSize: '18px',
        lineHeight: '22px',
        textTransform: 'none',
        color: active ? '#fff' : 'var(--color-900)',
        background: active ? '#1976d2' : 'transparent',
        border: '1px solid var(--color-primary)',
        borderRadius: '16px',

        '&:hover': {
          border: '1px solid var(--color-primary)',
          background: active ? '#1565c0' : '',
        },
      }}
      {...props}>
      {children}
    </Button>
  );
}
