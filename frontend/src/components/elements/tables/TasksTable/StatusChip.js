import React from 'react';
import Chip from '@mui/material/Chip';

export default function StatusChip({ isOpen = false }) {
  return (
    <Chip
      label={isOpen ? 'Открыт' : 'Закрыт'}
      sx={{
        color: '#fff',
        background: isOpen ? '#76BF5C' : '#BD2A09',
      }}
    />
  );
}
