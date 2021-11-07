import React, { useEffect, useState, useRef } from 'react';
import {
  IonList,
  IonItem,
  IonContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/react';
import { useFormikContext } from 'formik';
import DinheiroService, {
  Conta,
  ContasResponse,
} from '../../services/DinheiroService';
import CorIcone from '../cor-icone/CorIcone';

interface ContasModalProps {
  show: boolean;
  multiple?: boolean;
  initialValue?: Conta[] | null;
  selecionarConta?: (cor: Conta) => void;
  selecionarContas?: (contas: Conta[]) => void;
  onDidDismiss: () => void;
}

export default function ContasModal(props: ContasModalProps): JSX.Element {
  const [contaSelecionadas, setContaSelecionadas] = useState<Conta[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const modalRef = useRef<HTMLIonModalElement>(null);
  const { setFieldValue } = useFormikContext();
  const { initialValue } = props;

  useEffect(() => {
    fetchContaes();

    if (initialValue) {
      setContaSelecionadas(initialValue);
    }
  }, []);

  async function fetchContaes() {
    const dinheiro = new DinheiroService();
    const response: ContasResponse = await dinheiro.getContas();
    setContas(response.data);
  }

  function handleSelecionarConta(conta: Conta) {
    const { selecionarConta, multiple } = props;
    return multiple
      ? setContaSelecionadas((contasSelecionadas) => {
          const contaJaSelecionada = contasSelecionadas.find(
            (contaSelecionada) => contaSelecionada.id === conta.id
          );
          return contaJaSelecionada
            ? [
                ...contaSelecionadas.filter(
                  (contaSelecionada) => contaSelecionada.id !== conta.id
                ),
              ]
            : [...contasSelecionadas, conta];
        })
      : selecionarConta && selecionarConta(conta);
  }

  function handleOk() {
    const { selecionarContas } = props;
    return selecionarContas && selecionarContas(contaSelecionadas);
  }

  function handleLimpar() {
    setFieldValue('contas', []);
    setContaSelecionadas([]);
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
          <IonButtons slot="end">
            <IonButton onClick={() => handleLimpar()}>Limpar</IonButton>
            <IonButton onClick={() => handleOk()} color="primary">
              OK
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList id="contas-modal">
          {contas.map((conta: Conta) => (
            <IonItem
              onClick={() => handleSelecionarConta(conta)}
              button
              key={conta.id}
            >
              <CorIcone
                cor={conta.cor.hexadecimal}
                icone={
                  contaSelecionadas.find(
                    (contaSelecionada) => contaSelecionada.id === conta.id
                  )
                    ? 'checkmark'
                    : conta.icone
                }
              />
              <span className="ion-margin-start">{conta.nome}</span>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
}

ContasModal.defaultProps = {
  multiple: false,
  selecionarConta: () => null,
  selecionarContas: () => null,
  initialValue: null,
};
