import React, { useEffect, useState } from 'react';
import { IonItem, IonLabel, IonRow } from '@ionic/react';
import ContasModal from './ContasModal';
import { Conta } from '../../services/DinheiroService';
import CorIcone from '../cor-icone/CorIcone';

interface ContasInputInterface {
  initialValue?: Conta | null;
  onChange: (contaId: number) => void;
}

export default function ContasInput(props: ContasInputInterface): JSX.Element {
  const { onChange, initialValue } = props;
  const [showContasModal, setShowContasModal] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState<Conta>();

  useEffect(() => {
    if (initialValue) {
      setContaSelecionada(initialValue);
      onChange(initialValue.id);
    }
  }, []);

  function handleOnClick() {
    setShowContasModal(true);
  }

  function handleContaSelecionada(conta: Conta) {
    setContaSelecionada(conta);
    setShowContasModal(false);
    onChange(conta.id);
  }

  return (
    <>
      <IonItem onClick={() => handleOnClick()} className="contas-input" button>
        <IonLabel slot="start">Conta</IonLabel>
        <IonLabel slot="end">
          {contaSelecionada ? (
            <>
              <IonRow>
                <CorIcone
                  icone={contaSelecionada.icone}
                  cor={contaSelecionada.cor.hexadecimal}
                />
                <span className="ion-margin-start ion-margin-end">
                  {contaSelecionada.nome}
                </span>
              </IonRow>
            </>
          ) : null}
        </IonLabel>
      </IonItem>
      <ContasModal
        show={showContasModal}
        selecionarConta={(conta) => handleContaSelecionada(conta)}
        onDidDismiss={() => setShowContasModal(false)}
      />
    </>
  );
}

ContasInput.defaultProps = {
  initialValue: null,
};
