import React from 'react';
import CorIcone from '../cor-icone/CorIcone';
import { Conta } from '../../services/DinheiroService';
import './ContaContainer.scss';

interface ContaContainerProps {
  conta: Conta;
  small?: boolean;
}

export default function ContaContainer(
  props: ContaContainerProps
): JSX.Element {
  const { conta, small } = props;
  return (
    <div className={`conta-container ${small ? 'conta-container--small' : ''}`}>
      <CorIcone icone={conta.icone} cor={conta.cor.hexadecimal} />
      <span className="ion-margin-start ion-margin-end nome">{conta.nome}</span>
    </div>
  );
}

ContaContainer.defaultProps = {
  small: false,
};
