import {
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import DinheiroService from '../../services/DinheiroService';

interface ImportacaoModalProps {
  show: boolean;
  onDidDismiss: () => void;
}

export default function ImportacaoModal(
  props: ImportacaoModalProps
): JSX.Element {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [error, setError] = useState('');
  const history = useHistory();
  const { show, onDidDismiss } = props;

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (
      e.currentTarget &&
      e.currentTarget.files &&
      e.currentTarget.files.length > 0
    ) {
      setArquivo(e.currentTarget.files[0]);
      const formData = new FormData();
      formData.append('arquivo', e.currentTarget.files[0]);

      const dinheiroService = new DinheiroService();
      dinheiroService
        .importarExcel(formData)
        .then((response: any) =>
          history.push(
            `/movimentacoes/importacoes/${response.data.movimentacao_importacao.id}`
          )
        )
        .catch((errorResponse) => {
          if (errorResponse.response.data.status_codigo === 422) {
            setError(
              errorResponse.response.data.erros[
                Object.keys(errorResponse.response.data.erros)[0]
              ]
            );
          } else {
            setError('Ocorreu um erro ao tentar processar o arquivo.');
          }

          setArquivo(null);
        });
    } else {
      setArquivo(null);
    }
  }

  return (
    <IonModal isOpen={show} id="cor-modal" onDidDismiss={onDidDismiss}>
      <IonToolbar>
        <IonTitle>Importar via Excel</IonTitle>
      </IonToolbar>
      <IonList>
        <IonItem>
          Para importar as movimentações preencha o Excel conforme o modelo:
          <br />
          <a
            href="/Modelo - Importação movimentações.xlsx"
            className="ion-text-primary"
            download
          >
            Modelo de importação
          </a>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Arquivo de importação</IonLabel>
          <input
            key={arquivo?.name}
            type="file"
            className="ion-input"
            onChange={(e) => handleOnChange(e)}
          />
        </IonItem>
        {error && (
          <IonItem>
            <IonLabel color="danger">{error}</IonLabel>
          </IonItem>
        )}
      </IonList>
    </IonModal>
  );
}
