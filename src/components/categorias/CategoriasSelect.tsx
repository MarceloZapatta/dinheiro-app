import React, { useEffect, useState } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import CategoriasModal from './CategoriasModal';
import { Categoria } from '../../services/DinheiroService';
import './CategoriasSelect.scss';
import CategoriaContainer from './CategoriaContainer';

interface CategoriasSelectInterface {
  initialValue?: Categoria[] | null;
  onChange: (categorias: Categoria[]) => void;
}

export default function CategoriasSelect(
  props: CategoriasSelectInterface
): JSX.Element {
  const { onChange, initialValue } = props;
  const [showCategoriasModal, setShowCategoriasModal] = useState(false);
  const [categoriaSelecionadas, setCategoriaSelecionadas] = useState<
    Categoria[]
  >([]);

  useEffect(() => {
    if (initialValue) {
      setCategoriaSelecionadas(initialValue);
      onChange(initialValue);
    }
  }, []);

  function handleOnClick() {
    setShowCategoriasModal(true);
  }

  function handleCategoriaSelecionadas(categorias: Categoria[]) {
    setCategoriaSelecionadas(categorias);
    setShowCategoriasModal(false);
    onChange(categorias);
  }

  return (
    <>
      <IonItem
        onClick={() => handleOnClick()}
        className="categorias-select"
        button
      >
        <IonLabel slot="start">Categoria</IonLabel>
        <IonLabel slot="end">
          {categoriaSelecionadas.map((categoriaSelecionada) => (
            <CategoriaContainer categoria={categoriaSelecionada} />
          ))}
        </IonLabel>
      </IonItem>
      <CategoriasModal
        multiple
        initialValue={initialValue}
        show={showCategoriasModal}
        selecionarCategorias={(categorias) =>
          handleCategoriaSelecionadas(categorias)
        }
        onDidDismiss={() => setShowCategoriasModal(false)}
      />
    </>
  );
}

CategoriasSelect.defaultProps = {
  initialValue: null,
};
