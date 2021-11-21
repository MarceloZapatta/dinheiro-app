import React, { useEffect, useState, useRef } from 'react';
import {
  IonList,
  IonItem,
  IonContent,
  IonModal,
  IonHeader,
  IonLabel,
  IonIcon,
  IonInput,
  IonCol,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import axios, { CancelTokenSource } from 'axios';
import { search } from 'ionicons/icons';
import DinheiroService, {
  Cliente,
  ClientesResponse,
} from '../../services/DinheiroService';

interface ClientesModalProps {
  show: boolean;
  selecionarCliente: (cliente: Cliente) => void;
  onDidDismiss: () => void;
}

export default function ClientesModal(props: ClientesModalProps): JSX.Element {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const modalRef = useRef<HTMLIonModalElement>(null);
  const [busca, setBusca] = useState('');
  const [cancelToken, setCancelToken] = useState<CancelTokenSource | null>(
    null
  );

  useEffect(() => {
    fetchClientes();
  }, [busca]);

  async function fetchClientes() {
    if (cancelToken) {
      cancelToken.cancel();
    }
    const newCancelToken = axios.CancelToken.source();
    setCancelToken(newCancelToken);

    const dinheiro = new DinheiroService();
    const response: ClientesResponse = await dinheiro.getClientes(
      {
        busca,
      },
      newCancelToken
    );
    setClientes(response.data);
  }

  function handleSelecionarCliente(cliente: Cliente) {
    return props.selecionarCliente(cliente);
  }

  const { show, onDidDismiss } = props;

  return (
    <IonModal
      isOpen={show}
      id="cor-modal"
      onDidDismiss={onDidDismiss}
      ref={modalRef}
    >
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Selecione o cliente</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList id="clientes-modal">
          <IonItem>
            <IonLabel position="stacked">
              Buscar por nome, e-mail ou documento
            </IonLabel>
            <IonIcon icon={search} slot="start" size="small" color="primary" />
            <IonInput
              name="busca"
              value={busca}
              onIonChange={(e) => {
                setBusca(String(e.detail.value));
              }}
            />
          </IonItem>
          {clientes.map((cliente: Cliente) => (
            <IonItem
              onClick={() => handleSelecionarCliente(cliente)}
              button
              key={cliente.id}
            >
              <IonCol sizeXs="6">
                <IonLabel>{cliente.nome}</IonLabel>
              </IonCol>
              <IonCol sizeXs="6">
                <IonLabel>{cliente.email}</IonLabel>
              </IonCol>
              <IonCol sizeXs="0">
                <IonLabel>{cliente.documento}</IonLabel>
              </IonCol>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
}
