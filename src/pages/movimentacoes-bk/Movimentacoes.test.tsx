import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Movimentacoes from './Movimentacoes';
import MovimentacoesAdicionar from './MovimentacoesAdicionar';

test('movimentacoes renders without crashing', () => {
  const { baseElement } = render(
    <Router>
      <Movimentacoes />
    </Router>
  );
  expect(baseElement).toBeDefined();
});

test('movimentacoes adicionar renders without crashing', () => {
  const { baseElement } = render(
    <Router>
      <MovimentacoesAdicionar />
    </Router>
  );
  expect(baseElement).toBeDefined();
});
