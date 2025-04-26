import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

type QuizMenuProps = {
  correctCount: number;
  wrongCount: number;
  leftCount: number;
  isWatchResultsMode: boolean;
  handleClick: () => Promise<void>;
};

const QuizMenu = ({
  correctCount,
  wrongCount,
  leftCount,
  isWatchResultsMode,
  handleClick,
}: QuizMenuProps) => {
  return (
    <div className='absolute inset-x-0 bottom-6 z-10 mx-auto flex w-fit items-center rounded bg-[#323232] p-4 text-white'>
      <div className='flex gap-2'>
        <CheckIcon className='rounded-full bg-green-700 p-1' />
        {correctCount || 0}
      </div>
      <Divider
        className='!mx-3 !my-auto !h-4 !border-white'
        orientation='vertical'
        flexItem
      />
      <div className='flex gap-2'>
        <CloseIcon className='rounded-full bg-red-700 p-1' />
        {wrongCount || 0}
      </div>
      <Divider
        className='!mx-3 !my-auto !h-4 !border-white'
        orientation='vertical'
        flexItem
      />
      {isWatchResultsMode ? (
        <Button
          className='w-fit !text-white'
          variant='text'
          onClick={() => {
            void handleClick();
          }}
        >
          Начать заново
        </Button>
      ) : (
        <p>Осталось {leftCount || 0}</p>
      )}
    </div>
  );
};

export default QuizMenu;
