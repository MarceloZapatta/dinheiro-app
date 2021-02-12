import { render, wait } from '@testing-library/react';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';
import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Action } from 'history';
import Cadastrar from './Cadastrar';
import store from '../../store';

const action: Action = 'PUSH';
const location = {
  pathname: '',
  hash: '',
  search: '',
  state: '',
};

const history = {
  push: jest.fn(),
  length: 0,
  action,
  location,
  replace: jest.fn(),
  go: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  block: jest.fn(),
  listen: jest.fn(),
  createHref: jest.fn(),
};

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
  const { baseElement } = render(<Cadastrar history={history} />);
  expect(baseElement).toBeDefined();
});

test('nome inválido', async () => {
  const { findByTestId } = render(<Cadastrar history={history} />);

  const cadastrarPage = await findByTestId('cadastrar-page');

  expect(cadastrarPage).toBeInTheDocument();

  const cadastrarButton = await findByTestId('cadastrar-button');

  fireEvent.click(cadastrarButton);

  const nomeInvalidoText = await findByTestId('nome-invalido-text');

  expect(nomeInvalidoText).toBeInTheDocument();
});

test('e-mail obrigatório', async () => {
  const { findByTestId } = render(<Cadastrar history={history} />);

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
  const { findByTestId } = render(<Cadastrar history={history} />);

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

test('e-mail já utilizado', async () => {
  const { findByTestId } = render(<Cadastrar history={history} />);

  const cadastrarPage = await findByTestId('cadastrar-page');

  expect(cadastrarPage).toBeInTheDocument();

  const nomeInput = await findByTestId('nome-input');
  const senhaInput = await findByTestId('senha-input');
  const emailInput = await findByTestId('email-input');

  fireEvent.ionChange(nomeInput, 'teste');
  fireEvent.ionChange(senhaInput, '123456');
  fireEvent.ionChange(emailInput, 'email@utilizado.com.br');

  server.use(
    rest.post('http://127.0.0.1:8000/v1/auth/cadastrar', (req, res, ctx) => {
      return res(
        ctx.json({
          sucesso: false,
          status_codigo: 422,
          mensagem: 'Campos inválidos!',
          erros: {
            email: ['O valor informado para o campo e-mail já está em uso.'],
          },
        })
      );
    })
  );

  const cadastrarButton = await findByTestId('cadastrar-button');

  fireEvent.click(cadastrarButton);

  await findByTestId('email-ja-utilizado-text');
});

test('e-mail inválido 2', async () => {
  const { findByTestId } = render(<Cadastrar history={history} />);

  const cadastrarPage = await findByTestId('cadastrar-page');

  expect(cadastrarPage).toBeInTheDocument();

  const nomeInput = await findByTestId('nome-input');
  const senhaInput = await findByTestId('senha-input');
  const emailInput = await findByTestId('email-input');

  fireEvent.ionChange(nomeInput, 'teste');
  fireEvent.ionChange(senhaInput, '123456');
  fireEvent.ionChange(emailInput, 'email@utilizado.com.br');

  server.use(
    rest.post('http://127.0.0.1:8000/v1/auth/cadastrar', (req, res, ctx) => {
      return res(
        ctx.json({
          sucesso: false,
          status_codigo: 422,
          mensagem: 'Campos inválidos!',
          erros: {
            email: ['E-mail com outro erro!'],
          },
        })
      );
    })
  );

  const cadastrarButton = await findByTestId('cadastrar-button');

  fireEvent.click(cadastrarButton);

  await findByTestId('email-invalido-text');
});

test('senha inválida', async () => {
  const { findByTestId } = render(<Cadastrar history={history} />);

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

test('senha inválida 2', async () => {
  const { findByTestId } = render(<Cadastrar history={history} />);

  const cadastrarPage = await findByTestId('cadastrar-page');

  expect(cadastrarPage).toBeInTheDocument();

  const nomeInput = await findByTestId('nome-input');
  const senhaInput = await findByTestId('senha-input');
  const emailInput = await findByTestId('email-input');

  fireEvent.ionChange(nomeInput, 'teste');
  fireEvent.ionChange(
    senhaInput,
    'fasdjkofh1j2h3ji1hlhkjlhdsahfjihklhjkh1jk3hkj21hjkhkjhjkhasdkljh'
  );
  fireEvent.ionChange(emailInput, 'email@utilizado.com.br');

  server.use(
    rest.post('http://127.0.0.1:8000/v1/auth/cadastrar', (req, res, ctx) => {
      return res(
        ctx.json({
          sucesso: false,
          status_codigo: 422,
          mensagem: 'Campos inválidos!',
          erros: {
            senha: ['A senha é maior que o tamanho limite!'],
          },
        })
      );
    })
  );

  const cadastrarButton = await findByTestId('cadastrar-button');

  fireEvent.click(cadastrarButton);

  await findByTestId('senha-invalido-text');
});

test('erro campo generico', async () => {
  store.dispatch = jest.fn();

  const { findByTestId } = render(<Cadastrar history={history} />);

  const cadastrarPage = await findByTestId('cadastrar-page');

  expect(cadastrarPage).toBeInTheDocument();

  const nomeInput = await findByTestId('nome-input');
  const senhaInput = await findByTestId('senha-input');
  const emailInput = await findByTestId('email-input');

  fireEvent.ionChange(nomeInput, 'teste');
  fireEvent.ionChange(
    senhaInput,
    'fasdjkofh1j2h3ji1hlhkjlhdsahfjihklhjkh1jk3hkj21hjkhkjhjkhasdkljh'
  );
  fireEvent.ionChange(emailInput, 'email@utilizado.com.br');

  server.use(
    rest.post('http://127.0.0.1:8000/v1/auth/cadastrar', (req, res, ctx) => {
      return res(
        ctx.json({
          sucesso: false,
          status_codigo: 422,
          mensagem: 'Campos inválidos!',
          erros: {
            generico: ['Erro de campo genérico'],
          },
        })
      );
    })
  );

  const cadastrarButton = await findByTestId('cadastrar-button');

  fireEvent.click(cadastrarButton);

  const mensagemErro = JSON.stringify({
    type: 'alertErro/setShow',
    payload: { show: true, mensagem: 'Campos inválidos!' },
  });

  await wait(() => {
    expect(store.dispatch).toBeCalledTimes(1);
    expect(JSON.stringify((store.dispatch as jest.Mock).mock.calls[0][0])).toBe(
      mensagemErro
    );
  });
});

test('erro 422 sem campo erros', async () => {
  store.dispatch = jest.fn();

  const { findByTestId } = render(<Cadastrar history={history} />);

  const cadastrarPage = await findByTestId('cadastrar-page');

  expect(cadastrarPage).toBeInTheDocument();

  const nomeInput = await findByTestId('nome-input');
  const senhaInput = await findByTestId('senha-input');
  const emailInput = await findByTestId('email-input');

  fireEvent.ionChange(nomeInput, 'teste');
  fireEvent.ionChange(
    senhaInput,
    'fasdjkofh1j2h3ji1hlhkjlhdsahfjihklhjkh1jk3hkj21hjkhkjhjkhasdkljh'
  );
  fireEvent.ionChange(emailInput, 'email@utilizado.com.br');

  server.use(
    rest.post('http://127.0.0.1:8000/v1/auth/cadastrar', (req, res, ctx) => {
      return res(
        ctx.json({
          sucesso: false,
          status_codigo: 422,
          mensagem: 'Campos inválidos!',
          erros: {},
        })
      );
    })
  );

  const cadastrarButton = await findByTestId('cadastrar-button');

  fireEvent.click(cadastrarButton);

  const mensagemErro = JSON.stringify({
    type: 'alertErro/setShow',
    payload: { show: true, mensagem: 'Campos inválidos!' },
  });

  await wait(() => {
    expect(store.dispatch).toBeCalledTimes(1);
    expect(JSON.stringify((store.dispatch as jest.Mock).mock.calls[0][0])).toBe(
      mensagemErro
    );
  });
});

test('realiza o cadastro', async () => {
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
    expect(history.push.mock.calls[0][0]).toBe('/verificacao-email')
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

  const { findByTestId } = render(<Cadastrar history={history} />);

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
    expect(JSON.stringify((store.dispatch as jest.Mock).mock.calls[0][0])).toBe(
      mensagemErro
    );
  });
});

test('sem conexão com o server', async () => {
  store.dispatch = jest.fn();

  server.use(
    rest.post('http://127.0.0.1:8000/v1/auth/cadastrar', (req, res, ctx) => {
      throw new Error();
    })
  );

  const { findByTestId } = render(<Cadastrar history={history} />);

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
    expect(JSON.stringify((store.dispatch as jest.Mock).mock.calls[0][0])).toBe(
      mensagemErro
    );
  });
});
