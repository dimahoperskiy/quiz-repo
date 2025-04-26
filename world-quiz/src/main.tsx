import React from 'react';
import ReactDOM from 'react-dom/client';
import InteractiveMap from '@components/InteractiveMap';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@components/Home';
import { AuthProvider } from '@/context/AuthContext';
import Stats from '@components/Stats';
import LoginForm from '@components/LoginForm.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        index: true, // 👈 индексный маршрут (default)
        element: (
          <>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              Исследуйте мир на интерактивной карте
            </h2>
            <p className='mt-4'>
              Наведите курсор на страну, чтобы узнать ее расположение и другую
              информацию. Используйте эту карту, чтобы подготовиться к викторине
              или просто изучить мир.
            </p>
          </>
        ),
      },
      { path: 'login', element: <LoginForm /> },
      { path: 'stats', element: <Stats /> },
    ],
  },
  {
    path: 'quiz',
    element: <InteractiveMap />,
  },
  {
    path: 'explore',
    element: <InteractiveMap isExplore />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
