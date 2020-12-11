import { render } from '@testing-library/react';
import React from 'react';
import Cadastrar from './Cadastrar';

test('renders without crashing', () => {
  const { baseElement } = render(<Cadastrar />);
  expect(baseElement).toBeDefined();
});
