import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  it('должен отобразить заголовок Вход', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </MemoryRouter>,
    );
    const heading = screen.getByRole('heading', { name: /вход/i });
    expect(heading).toBeInTheDocument();
  });

  it('позволяет вводить email и пароль', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </MemoryRouter>,
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/пароль/i);

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, '123456');

    expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
    expect((passwordInput as HTMLInputElement).value).toBe('123456');
  });
});
