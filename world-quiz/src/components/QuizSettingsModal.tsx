import { Dispatch, SetStateAction } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

type QuizSettingsModalProps = {
  handleClick: () => void;
  isExplore?: boolean;
  countriesCount: number;
  setCountriesCount: Dispatch<SetStateAction<number>>;
  setCountriesLeft: Dispatch<SetStateAction<number>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const QuizSettingsModal = ({
  handleClick,
  countriesCount,
  setCountriesCount,
  open,
  setOpen,
  setCountriesLeft,
}: QuizSettingsModalProps) => {
  const handleClose = () => setOpen(false);
  const handleChange = (event: SelectChangeEvent<number>) => {
    if (typeof event.target.value !== 'number') return;
    setCountriesCount(event.target.value);
    setCountriesLeft(event.target.value);
  };
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
      className='m-auto h-fit w-1/4 rounded-lg shadow-2xl'
      open={open}
    >
      <div className='flex size-full flex-col rounded-lg bg-[#0000001c] p-6 !outline-0 backdrop-blur-md'>
        <h1 className='mb-4 text-center text-3xl text-white'>Настроки квиза</h1>
        <FormControl
          variant='standard'
          className='w-full text-white'
          size='small'
          sx={{
            '.MuiInput-root::before': {
              borderBottom: '1px solid',
            },
            '.MuiSelect-icon': {
              color: 'white',
            },
          }}
        >
          <p className='mb-2 text-xl'>Выберите количество стран для квиза</p>
          <Select
            id='demo-simple-select'
            value={countriesCount}
            onChange={handleChange}
            className='!text-white'
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={300}>Все страны</MenuItem>
          </Select>
        </FormControl>
        <Button
          color='success'
          className='!mx-auto !mb-0 !mt-10 w-fit'
          variant='contained'
          onClick={() => {
            handleClose();
            void handleClick();
          }}
        >
          Начать квиз
        </Button>
      </div>
    </Modal>
  );
};

export default QuizSettingsModal;
