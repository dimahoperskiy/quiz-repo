import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string>('');
  const { user, login, register } = useAuth();

  const handleSubmit = async (): Promise<void> => {
    setError('');

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (!success) setError('Неверные данные');
      } else {
        const success = await register(email, password);
        if (success) setMode('login');
        else setError('Ошибка регистрации');
      }
    } catch {
      setError('Ошибка сервера');
    }
  };

  if (user) {
    return (
      <div>
        <Link className='absolute left-0 top-0' to='/'>
          <ArrowBackIcon />
        </Link>
        <div className='text-lg text-black'>
          Вы вошли как <strong>{user.email}</strong>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link className='absolute left-0 top-0' to='/'>
        <ArrowBackIcon />
      </Link>

      <div className='mx-auto mt-4 w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 text-black shadow-xl'>
        <h2 className='mb-4 text-center text-2xl font-semibold'>
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </h2>

        <div className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e): void => setEmail(e.target.value)}
            className='w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <input
            type='password'
            placeholder='Пароль'
            value={password}
            onChange={(e): void => setPassword(e.target.value)}
            className='w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />

          <button
            onClick={void handleSubmit}
            className='w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700'
          >
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>

          <p className='text-center text-sm text-gray-700'>
            {mode === 'login' ? (
              <>
                Нет аккаунта?{' '}
                <button
                  onClick={(): void => setMode('register')}
                  className='text-blue-600 underline'
                >
                  Зарегистрироваться
                </button>
              </>
            ) : (
              <>
                Уже есть аккаунт?{' '}
                <button
                  onClick={(): void => setMode('login')}
                  className='text-blue-600 underline'
                >
                  Войти
                </button>
              </>
            )}
          </p>

          {error && (
            <p className='mt-2 text-center text-sm text-red-500'>{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
