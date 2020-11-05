import React from 'react';
import { render, wait } from '@testing-library/react';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import Login from './Login';

test('renders without crashing', () => {
  const { baseElement } = render(<Login />);
  expect(baseElement).toBeDefined();
});

test('e-mail obrigatorio', async () => {
  const { findByTestId } = render(<Login />);

  const loginPage = await findByTestId('login-page');

  expect(loginPage).toBeInTheDocument();

  const entrarButton = await findByTestId('entrar-button');

  fireEvent.click(entrarButton);

  const emailInvalidoText = await findByTestId('email-invalido-text');

  expect(emailInvalidoText).toBeInTheDocument();
});

test('e-mail invalido', async () => {
  const { findByTestId } = render(<Login />);

  const loginPage = await findByTestId('login-page');

  expect(loginPage).toBeInTheDocument();

  const emailInput = await findByTestId('email-input');
  const senhaInput = await findByTestId('senha-input');
  const entrarButton = await findByTestId('entrar-button');

  fireEvent.ionChange(emailInput, 'test');
  fireEvent.ionChange(senhaInput, '123456');

  fireEvent.click(entrarButton);

  const emailInvalidoText = await findByTestId('email-invalido-text');

  expect(emailInvalidoText).toBeInTheDocument();
});

test('senha inválida', async () => {
  const { findByTestId } = render(<Login />);

  const loginPage = await findByTestId('login-page');

  expect(loginPage).toBeInTheDocument();

  const emailInput = await findByTestId('email-input');
  const entrarButton = await findByTestId('entrar-button');

  fireEvent.ionChange(emailInput, 'test@email.com');

  fireEvent.click(entrarButton);

  const senhaInvalidaText = await findByTestId('password-invalido-text');

  expect(senhaInvalidaText).toBeInTheDocument();
});

test('should login', async () => {
  const history = {
    push: jest.fn(),
  };

  const { findByTestId } = render(<Login history={history} />);

  const loginPage = await findByTestId('login-page');

  expect(loginPage).toBeInTheDocument();

  const emailInput = await findByTestId('email-input');
  const senhaInput = await findByTestId('senha-input');
  const entrarButton = await findByTestId('entrar-button');

  fireEvent.ionChange(emailInput, 'test@login.com');
  fireEvent.ionChange(senhaInput, '123456');

  fireEvent.click(entrarButton);

  await wait(() =>
    expect(history.push.mock.calls[0][0]).toBe('/movimentacoes')
  );
});
