import React, { useEffect, useState } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import ContasModal from './ContasModal';
import { Conta } from '../../services/DinheiroService';
import './ContasSelect.scss';
import ContaContainer from './ContaContainer';

interface ContasSelectInterface {
  initialValue?: Conta[] | null;
  onChange: (contas: Conta[]) => void;
}

export default function ContasSelect(
  props: ContasSelectInterface
): JSX.Element {
  const { onChange, initialValue } = props;
  const [showContasModal, setShowContasModal] = useState(false);
  const [contaSelecionadas, setContaSelecionadas] = useState<Conta[]>([]);

  useEffect(() => {
    if (initialValue) {
      setContaSelecionadas(initialValue);
      onChange(initialValue);
    }
  }, []);

  function handleOnClick() {
    setShowContasModal(true);
  }

  function handleContaSelecionadas(contas: Conta[]) {
    setContaSelecionadas(contas);
    setShowContasModal(false);
    onChange(contas);
  }

  return (
    <>
      <IonItem onClick={() => handleOnClick()} className="contas-select" button>
        <IonLabel slot="start">Conta</IonLabel>
        <IonLabel slot="end">
          {contaSelecionadas.map((contaSelecionada) => (
            <ContaContainer conta={contaSelecionada} />
          ))}
        </IonLabel>
      </IonItem>
      <ContasModal
        multiple
        show={showContasModal}
        initialValue={initialValue}
        selecionarContas={(contas) => handleContaSelecionadas(contas)}
        onDidDismiss={() => setShowContasModal(false)}
      />
    </>
  );
}

ContasSelect.defaultProps = {
  initialValue: null,
};
