import { Typography } from '@mui/material';
import BaseModal from '../BaseModal';
import { styled } from '@mui/material/styles';
import AppButton from '../../buttons/AppButton';
import { Link } from 'react-router-dom';
import { Stack } from '@mui/system';

const Title = styled(Typography)({
  fontFamily: 'inherit',
  fontWeight: 700,
  fontSize: '48px',
  marginBottom: '32px',
  textAlign: 'center',
});

const Text = styled(Typography)({
  fontFamily: 'inherit',
  fontWeight: 400,
  fontSize: '24px',
  textAlign: 'center',
});

const AnswerModal = ({ open, onClose, isCorrectlySolved, points }) => {
  return (
    <BaseModal open={open} onClose={onClose}>
      <Title
        sx={{
          color: isCorrectlySolved
            ? 'var(--color-success-acc1)'
            : 'var(--color-error-acc1)',
        }}>
        {isCorrectlySolved ? 'Верно!' : 'Неверно!'}
      </Title>
      <Text>
        {isCorrectlySolved ? (
          <>
            Вы правильно решили задачу-головоломку!
            <br />
            Вы получаете {points} баллов!
          </>
        ) : (
          <>К сожалению, ответ неправильный!</>
        )}
      </Text>
      <Stack
        sx={{ display: 'grid', placeContent: 'center', marginTop: '64px' }}>
        <Link to='/home'>
          <AppButton>На главную</AppButton>
        </Link>
      </Stack>
    </BaseModal>
  );
};

export default AnswerModal;
