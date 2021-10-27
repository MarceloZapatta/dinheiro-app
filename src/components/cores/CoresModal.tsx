import React, { useEffect, useState } from 'react';
import { IonList, IonItem, IonContent, IonModal } from '@ionic/react';
import DinheiroService, {
  Cor,
  CoresResponse,
} from '../../services/DinheiroService';
import './CoresModal.scss';

interface CoresModalProps {
  show: boolean;
  selecionarCor: (cor: Cor) => void;
  onDidDismiss: () => void;
}

export default function CoresModal(props: CoresModalProps): JSX.Element {
  const [cores, setCores] = useState<Cor[]>([]);

  useEffect(() => {
    fetchCores();
  }, []);

  async function fetchCores() {
    const dinheiro = new DinheiroService();
    const response: CoresResponse = await dinheiro.getCores();
    setCores(response.data);
  }

  function toSnakeCase(string: string): string {
    return string
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join('_');
  }

  function handleSelecionarCor(cor: Cor) {
    const { selecionarCor } = props;
    selecionarCor(cor);
  }

  const { show, onDidDismiss } = props;

  return (
    <IonContent>
      <IonModal isOpen={show} id="cor-modal" onDidDismiss={onDidDismiss}>
        <IonList id="cores-modal">
          {cores.map((cor: Cor) => (
            <IonItem
              onClick={() => handleSelecionarCor(cor)}
              button
              key={cor.id}
            >
              <div className={`holder-color cor-${toSnakeCase(cor.nome)}`} />
              {cor.nome}
            </IonItem>
          ))}
        </IonList>
      </IonModal>
    </IonContent>
  );
}
