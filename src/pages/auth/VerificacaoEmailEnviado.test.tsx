import { render } from '@testing-library/react';
import React from 'react';
import VerificacaoEmailEnviado from './VerificacaoEmailEnviado';

test('renders without crashing', () => {
  const { baseElement } = render(<VerificacaoEmailEnviado />);
  expect(baseElement).toBeDefined();
});
