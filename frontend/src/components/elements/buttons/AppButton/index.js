import { Button } from '@mui/material';
import React from 'react';

export default function AppButton({ children, onClick, sx, ...props }) {
  return (
    <Button
      variant='contained'
      onClick={onClick}
      sx={{
        p: '8px 16px',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '150%',
        fontFamily: 'inherit',
        textTransform: 'none',
        borderRadius: '12px',
        boxShadow: 'none',

        ...sx,
      }}
      {...props}>
      {children}
    </Button>
  );
}
