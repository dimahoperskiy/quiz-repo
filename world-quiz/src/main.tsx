import React from 'react';
import ReactDOM from 'react-dom/client';
import InteractiveMap from '@components/InteractiveMap';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@components/Home';
import Stats from '@components/Stats';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        index: true,
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
    <RouterProvider router={router} />
  </React.StrictMode>,
);
