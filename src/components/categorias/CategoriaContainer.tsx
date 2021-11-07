import React from 'react';
import CorIcone from '../cor-icone/CorIcone';
import { Categoria } from '../../services/DinheiroService';
import './CategoriaContainer.scss';

interface CategoriaContainerProps {
  categoria: Categoria;
  small?: boolean;
}

export default function CategoriaContainer(
  props: CategoriaContainerProps
): JSX.Element {
  const { categoria, small } = props;
  return (
    <div
      className={`categoria-container ${
        small ? 'categoria-container--small' : ''
      }`}
    >
      <CorIcone icone={categoria.icone} cor={categoria.cor.hexadecimal} />
      <span className="ion-margin-start ion-margin-end nome">
        {categoria.nome}
      </span>
    </div>
  );
}

CategoriaContainer.defaultProps = {
  small: false,
};
