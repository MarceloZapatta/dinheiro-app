import { render, wait } from '@testing-library/react';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Cadastrar from './Cadastrar';
import store from '../../store';

const server = setupServer(
  rest.post('http://127.0.0.1:8000/v1/auth/cadastrar', (req, res, ctx) => {
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
  const { baseElement } = render(<Cadastrar />);
  expect(baseElement).toBeDefined();
});

test('nome inválido', async () => {
  const { findByTestId } = render(<Cadastrar />);

  const cadastrarPage = await findByTestId('cadastrar-page');

  expect(cadastrarPage).toBeInTheDocument();

  const cadastrarButton = await findByTestId('cadastrar-button');

  fireEvent.click(cadastrarButton);

  const nomeInvalidoText = await findByTestId('nome-invalido-text');

  expect(nomeInvalidoText).toBeInTheDocument();
});

test('e-mail obrigatório', async () => {
  const { findByTestId } = render(<Cadastrar />);

  const cadastrarPage = await findByTestId('cadastrar-page');

  expect(cadastrarPage).toBeInTheDocument();

  const nomeInput = await findByTestId('nome-input');

  fireEvent.ionChange(nomeInput, 'teste');

  const cadastrarButton = await findByTestId('cadastrar-button');

  fireEvent.click(cadastrarButton);

  const emailInvalidoText = await findByTestId('email-invalido-text');

  expect(emailInvalidoText).toBeInTheDocument();
});

test('e-mail inválido', async () => {
  const { findByTestId } = render(<Cadastrar />);

  const cadastrarPage = await findByTestId('cadastrar-page');

  expect(cadastrarPage).toBeInTheDocument();

  const nomeInput = await findByTestId('nome-input');
  const senhaInput = await findByTestId('senha-input');
  const emailInput = await findByTestId('email-input');

  fireEvent.ionChange(nomeInput, 'teste');
  fireEvent.ionChange(senhaInput, '123456');
  fireEvent.ionChange(emailInput, 'emailinvalido');

  const cadastrarButton = await findByTestId('cadastrar-button');

  fireEvent.click(cadastrarButton);

  const emailInvalidoText = await findByTestId('email-invalido-text');

  expect(emailInvalidoText).toBeInTheDocument();
});

test('senha inválida', async () => {
  const { findByTestId } = render(<Cadastrar />);

  const cadastrarPage = await findByTestId('cadastrar-page');

  expect(cadastrarPage).toBeInTheDocument();

  const nomeInput = await findByTestId('nome-input');
  const emailInput = await findByTestId('email-input');

  fireEvent.ionChange(nomeInput, 'teste');
  fireEvent.ionChange(emailInput, 'marcelo@teste.com');

  const cadastrarButton = await findByTestId('cadastrar-button');

  fireEvent.click(cadastrarButton);

  const emailInvalidoText = await findByTestId('senha-invalido-text');

  expect(emailInvalidoText).toBeInTheDocument();
});

test('realiza o cadastro', async () => {
  const history = {
    push: jest.fn(),
  };

  const { findByTestId } = render(<Cadastrar history={history} />);

  const cadastrarPage = await findByTestId('cadastrar-page');

  expect(cadastrarPage).toBeInTheDocument();

  const nomeInput = await findByTestId('nome-input');
  const emailInput = await findByTestId('email-input');
  const senhaInput = await findByTestId('senha-input');
  const cadastrarButton = await findByTestId('cadastrar-button');

  fireEvent.ionChange(nomeInput, 'marcelo');
  fireEvent.ionChange(emailInput, 'test@cadastro.com');
  fireEvent.ionChange(senhaInput, '123456');

  fireEvent.click(cadastrarButton);

  await wait(() =>
    expect(history.push.mock.calls[0][0]).toBe('/movimentacoes')
  );
});

test('cadastro inválido', async () => {
  store.dispatch = jest.fn();

  server.use(
    rest.post('http://127.0.0.1:8000/v1/auth/cadastrar', (req, res, ctx) => {
      return res(
        ctx.json({
          sucesso: false,
        })
      );
    })
  );

  const { findByTestId } = render(<Cadastrar />);

  const cadastrarPage = await findByTestId('cadastrar-page');

  expect(cadastrarPage).toBeInTheDocument();

  const nomeInput = await findByTestId('nome-input');
  const emailInput = await findByTestId('email-input');
  const senhaInput = await findByTestId('senha-input');
  const cadastrarButton = await findByTestId('cadastrar-button');

  fireEvent.ionChange(nomeInput, 'marcelo');
  fireEvent.ionChange(emailInput, 'test@login.com');
  fireEvent.ionChange(senhaInput, '123456');

  fireEvent.click(cadastrarButton);

  const mensagemErro = JSON.stringify({
    type: 'alertErro/setShow',
    payload: { show: true },
  });

  await wait(() => {
    expect(store.dispatch).toBeCalledTimes(1);
    expect(JSON.stringify(store.dispatch.mock.calls[0][0])).toBe(mensagemErro);
  });
});

test('sem conexão com o server', async () => {
  store.dispatch = jest.fn();

  server.use(
    rest.post('http://127.0.0.1:8000/v1/auth/cadastrar', (req, res, ctx) => {
      throw new Error();
    })
  );

  const { findByTestId } = render(<Cadastrar />);

  const cadastrarPage = await findByTestId('cadastrar-page');

  expect(cadastrarPage).toBeInTheDocument();

  const nomeInput = await findByTestId('nome-input');
  const emailInput = await findByTestId('email-input');
  const senhaInput = await findByTestId('senha-input');
  const cadastrarButton = await findByTestId('cadastrar-button');

  fireEvent.ionChange(nomeInput, 'marcelo');
  fireEvent.ionChange(emailInput, 'test@login.com');
  fireEvent.ionChange(senhaInput, '123456');

  fireEvent.click(cadastrarButton);

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
