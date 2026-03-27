import { Link, Outlet } from 'react-router-dom';
import worldImg from '@assets/world4.jpg';
import BarChartIcon from '@mui/icons-material/BarChart';

const Home = () => {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='bg-black px-4 py-6 text-white md:px-6'>
        <div className='relative mx-auto flex max-w-6xl items-center justify-between'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold'>Географическая викторина</h1>
            <p className='text-lg'>
              Проверьте свои знания о расположении стран на карте мира!
            </p>
          </div>
          <div className='ml-auto flex flex-col gap-2'>
            <Link
              to='quiz'
              className='inline-flex items-center justify-center rounded-md bg-white px-6 py-2 text-sm font-medium text-black'
            >
              Пройти квиз
            </Link>
            <Link
              to='explore'
              className='inline-flex items-center justify-center rounded-md border bg-white px-6 py-2 text-sm font-medium text-black shadow-sm transition-colors'
            >
              Изучить карту
            </Link>
          </div>
          <div className='mx-10 flex gap-4'>
            <Link className='flex gap-2' to='/stats'>
              <span>Статистика</span>
              <BarChartIcon />
            </Link>
          </div>
        </div>
      </header>

      <main className='flex-1 py-12 md:py-16 lg:py-20'>
        <div className='mx-auto max-w-6xl px-4 md:px-6'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12'>
            <div className='relative flex flex-col justify-center'>
              <Outlet />
            </div>
            <div className='relative h-[500px] w-full overflow-hidden rounded-xl'>
              <img src={worldImg} />
            </div>
          </div>
        </div>
      </main>

      <footer className='px-4 py-6 md:px-6'>
        <div className='mx-auto flex max-w-6xl items-center justify-end'>
          <div className='flex gap-4'>Дмитрий Хопёрский</div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
