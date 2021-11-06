import React, { useEffect, useState } from 'react';
import { IonList, IonItem, IonContent, IonModal } from '@ionic/react';
import DinheiroService, {
  Conta,
  ContasResponse,
} from '../../services/DinheiroService';
import CorIcone from '../cor-icone/CorIcone';

interface ContasModalProps {
  show: boolean;
  selecionarConta: (cor: Conta) => void;
  onDidDismiss: () => void;
}

export default function ContaesModal(props: ContasModalProps): JSX.Element {
  const [contas, setContas] = useState<Conta[]>([]);

  useEffect(() => {
    fetchContaes();
  }, []);

  async function fetchContaes() {
    const dinheiro = new DinheiroService();
    const response: ContasResponse = await dinheiro.getContas();
    setContas(response.data);
  }

  function handleSelecionarConta(conta: Conta) {
    const { selecionarConta } = props;
    selecionarConta(conta);
  }

  const { show, onDidDismiss } = props;

  return (
    <IonContent>
      <IonModal isOpen={show} id="cor-modal" onDidDismiss={onDidDismiss}>
        <IonList id="contas-modal">
          {contas.map((conta: Conta) => (
            <IonItem
              onClick={() => handleSelecionarConta(conta)}
              button
              key={conta.id}
            >
              <CorIcone cor={conta.cor.hexadecimal} icone={conta.icone} />
              <span className="ion-margin-start">{conta.nome}</span>
            </IonItem>
          ))}
        </IonList>
      </IonModal>
    </IonContent>
  );
}
