import React, { useEffect, useState } from 'react';
import { IonItem, IonLabel, IonRow } from '@ionic/react';
import CategoriasModal from './CategoriasModal';
import { Categoria } from '../../services/DinheiroService';
import CorIcone from '../cor-icone/CorIcone';

interface CategoriasInputInterface {
  initialValue?: Categoria | null;
  onChange: (categoriaId: number) => void;
  disabled?: boolean;
}

export default function CategoriasInput(
  props: CategoriasInputInterface
): JSX.Element {
  const { onChange, initialValue, disabled } = props;
  const [showCategoriasModal, setShowCategoriasModal] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria>();

  useEffect(() => {
    if (initialValue) {
      setCategoriaSelecionada(initialValue);
      onChange(initialValue.id);
    }
  }, []);

  function handleOnClick() {
    if (!disabled) {
      setShowCategoriasModal(true);
    }
  }

  function handleCategoriaSelecionada(categoria: Categoria) {
    setCategoriaSelecionada(categoria);
    setShowCategoriasModal(false);
    onChange(categoria.id);
  }

  return (
    <>
      <IonItem
        onClick={() => handleOnClick()}
        className="categorias-input"
        button={!disabled}
        disabled={disabled}
      >
        <IonLabel slot="start">Categoria</IonLabel>
        <IonLabel slot="end">
          {categoriaSelecionada ? (
            <>
              <IonRow>
                <CorIcone
                  icone={categoriaSelecionada.icone}
                  cor={categoriaSelecionada.cor.hexadecimal}
                />
                <span className="ion-margin-start ion-margin-end">
                  {categoriaSelecionada.nome}
                </span>
              </IonRow>
            </>
          ) : null}
        </IonLabel>
      </IonItem>
      <CategoriasModal
        show={showCategoriasModal}
        selecionarCategoria={(categoria) =>
          handleCategoriaSelecionada(categoria)
        }
        onDidDismiss={() => setShowCategoriasModal(false)}
      />
    </>
  );
}

CategoriasInput.defaultProps = {
  initialValue: null,
  disabled: false,
};
