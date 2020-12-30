import React from 'react';
import { render, wait } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import store from '../../store';
import Login from './Login';

const server = setupServer(
  rest.post('http://127.0.0.1:8000/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        sucesso: true,
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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

test('realiza o login', async () => {
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

test('login inválido', async () => {
  store.dispatch = jest.fn();

  server.use(
    rest.post('http://127.0.0.1:8000/v1/auth/login', (req, res, ctx) => {
      return res(
        ctx.json({
          sucesso: false,
        })
      );
    })
  );

  const { findByTestId } = render(<Login />);

  const loginPage = await findByTestId('login-page');

  expect(loginPage).toBeInTheDocument();

  const emailInput = await findByTestId('email-input');
  const senhaInput = await findByTestId('senha-input');
  const entrarButton = await findByTestId('entrar-button');

  fireEvent.ionChange(emailInput, 'test@login.com');
  fireEvent.ionChange(senhaInput, '123456');

  fireEvent.click(entrarButton);

  const mensagemErro = JSON.stringify({
    type: 'alertErro/setShow',
    payload: { show: true },
  });

  await wait(() => {
    expect(store.dispatch).toBeCalledTimes(1);
    expect(JSON.stringify(store.dispatch.mock.calls[0][0])).toBe(mensagemErro);
  });
});

test('sem conexao com o server', async () => {
  store.dispatch = jest.fn();

  server.use(
    rest.post('http://127.0.0.1:8000/v1/auth/login', (req, res, ctx) => {
      throw new Error();
    })
  );

  const { findByTestId } = render(<Login />);

  const loginPage = await findByTestId('login-page');

  expect(loginPage).toBeInTheDocument();

  const emailInput = await findByTestId('email-input');
  const senhaInput = await findByTestId('senha-input');
  const entrarButton = await findByTestId('entrar-button');

  fireEvent.ionChange(emailInput, 'test@login.com');
  fireEvent.ionChange(senhaInput, '123456');

  fireEvent.click(entrarButton);

  const mensagemErro = JSON.stringify({
    type: 'alertErro/setShow',
    payload: {
      show: true,
      mensagem: 'Erro de conexão. Tente novamente mais tarde.',
    },
  });

  await wait(() => {
    expect(store.dispatch).toBeCalledTimes(1);
    expect(JSON.stringify(store.dispatch.mock.calls[0][0])).toBe(mensagemErro);
  });
});

test('modificou os campos', async () => {
  Login.prototype.setState = jest.fn();

  const setStateSpy = jest.spyOn(Login.prototype, 'setState');

  const { findByTestId } = render(<Login />);

  const loginPage = await findByTestId('login-page');

  expect(loginPage).toBeInTheDocument();

  const emailInput = await findByTestId('email-input');
  const senhaInput = await findByTestId('senha-input');

  fireEvent.ionChange(emailInput, 'test@login.com');
  expect(setStateSpy).toBeCalledWith({ email: 'test@login.com' });

  fireEvent.ionChange(senhaInput, '123456');
  expect(setStateSpy).toBeCalledWith({ password: '123456' });

  expect(setStateSpy).toHaveBeenCalledTimes(2);
});
