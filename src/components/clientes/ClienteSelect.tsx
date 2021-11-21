import React, { useState, useEffect } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import ClientesModal from './ClientesModal';
import { Cliente } from '../../services/DinheiroService';

interface ClienteSelectInterface {
  onChange: (cliente: Cliente) => void;
  initialValue?: Cliente;
  disabled?: boolean;
}

export default function ClienteSelect(
  props: ClienteSelectInterface
): JSX.Element {
  const { onChange, initialValue, disabled } = props;
  const [showClientesModal, setShowClientesModal] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null
  );

  useEffect(() => {
    if (initialValue) {
      props.onChange(initialValue);
    }
  }, []);

  function handleOnClick() {
    if (!disabled) {
      setShowClientesModal(true);
    }
  }

  function handleClienteSelecionado(cliente: Cliente) {
    setClienteSelecionado(cliente);
    setShowClientesModal(false);
    onChange(cliente);
  }

  return (
    <>
      <IonItem
        onClick={() => handleOnClick()}
        button={!disabled}
        disabled={disabled}
      >
        <IonLabel slot="start">Cliente</IonLabel>
        <IonLabel slot="end">
          {clienteSelecionado?.nome || initialValue?.nome}
        </IonLabel>
      </IonItem>
      <ClientesModal
        show={showClientesModal}
        selecionarCliente={(cliente) => handleClienteSelecionado(cliente)}
        onDidDismiss={() => setShowClientesModal(false)}
      />
    </>
  );
}

ClienteSelect.defaultProps = {
  initialValue: null,
  disabled: false,
};
