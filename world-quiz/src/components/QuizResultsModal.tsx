import { Dispatch, SetStateAction } from 'react';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import cx from 'classnames';
import Button from '@mui/material/Button';

type QuizResultsModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  progress: number;
  handleClick: () => void;
  setShowQuizMenu: Dispatch<SetStateAction<boolean>>;
  redrawFeatures: () => void;
};

const QuizResultsModal = ({
  open,
  setOpen,
  progress,
  handleClick,
  setShowQuizMenu,
  redrawFeatures,
}: QuizResultsModalProps) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      disableAutoFocus
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
      }}
      className='m-auto h-fit w-1/4 rounded-lg text-white shadow-2xl'
      open={open}
    >
      <div className='flex flex-col justify-center rounded-lg bg-[#0000001c] p-6 !outline-0 backdrop-blur-md'>
        <h1 className='mb-4 text-center text-3xl'>Результаты:</h1>
        <div className='relative flex justify-center'>
          <CircularProgress
            thickness={6}
            size={100}
            variant='determinate'
            value={progress}
            className={cx(
              progress < 50 && '!text-red-600',
              progress >= 50 && progress < 80 && '!text-yellow-400',
              progress >= 80 && '!text-green-600',
            )}
          />
          <span className='absolute inset-0 m-auto size-fit text-xl font-bold'>
            {progress}%
          </span>
        </div>
        <Button
          onClick={() => {
            handleClose();
            setShowQuizMenu(true);
            redrawFeatures();
          }}
          className='!mx-auto !mb-0 !mt-10 w-fit'
          variant='contained'
        >
          Вернуться на карту
        </Button>
        <Button
          color='success'
          className='!mx-auto !mb-0 !mt-4 w-fit'
          variant='contained'
          onClick={() => {
            handleClose();
            void handleClick();
          }}
        >
          Начать заново
        </Button>
      </div>
    </Modal>
  );
};

export default QuizResultsModal;
