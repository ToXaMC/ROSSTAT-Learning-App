import React from 'react';
import { Modal } from '@mui/material';
import { Box } from '@mui/system';

export default function BaseModal({ children, open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        p: 8,
      }}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '1200px',
          background: '#fff',
          borderRadius: '16px',
          p: 4,
          maxHeight: '800px',
          overflow: 'auto',
        }}>
        {children}
      </Box>
    </Modal>
  );
}
