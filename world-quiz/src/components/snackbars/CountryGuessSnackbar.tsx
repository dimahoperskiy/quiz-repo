import Snackbar from '@mui/material/Snackbar';
import { Dispatch, SetStateAction } from 'react';

type CountryGuessSnackbarProps = {
  snackbarOpen: boolean;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  snackbarMessage: string;
};

const CountryGuessSnackbar = ({
  snackbarOpen,
  setSnackbarOpen,
  snackbarMessage,
}: CountryGuessSnackbarProps) => {
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <Snackbar
      onClose={handleSnackbarClose}
      message={`Найдите страну: ${snackbarMessage}`}
      open={snackbarOpen}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    />
  );
};

export default CountryGuessSnackbar;
