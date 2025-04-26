import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { Dispatch, SetStateAction } from 'react';

type AlertProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const WrongAlert = ({ open, setOpen }: AlertProps) => {
  const handleClose = (
    event: React.SyntheticEvent<any> | Event,
    reason: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        // onClose={handleClose}
        severity='error'
        variant='filled'
        sx={{ width: '100%' }}
      >
        Неверно
      </Alert>
    </Snackbar>
  );
};

export default WrongAlert;
