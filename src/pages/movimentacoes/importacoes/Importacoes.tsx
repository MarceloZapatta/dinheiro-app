import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';

import Header from '../../../components/Header';

import DinheiroService, {
  MovimentacaoImportacao,
} from '../../../services/DinheiroService';

export default function Importacoes(): JSX.Element {
  const [movimentacoesImportacoes, setMovimentacoesImportacoes] = useState<
    MovimentacaoImportacao[]
  >([]);
  useEffect(() => {
    fetchMovimentacaoImportacoes();
  }, []);

  async function fetchMovimentacaoImportacoes() {
    const dinheiro = new DinheiroService();
    dinheiro
      .getMovimentacaoImportacoes()
      .then((response) => setMovimentacoesImportacoes(response.data));
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Importações" disableBackButton />
      <IonContent>
        <IonGrid>
          <IonRow class="ion-margin-top">
            <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
              <IonList>
                {movimentacoesImportacoes.map((movimentacaoImportacao) => (
                  <IonItem
                    key={movimentacaoImportacao.id}
                    button
                    routerLink={`/movimentacoes/importacoes/${movimentacaoImportacao.id}`}
                  >
                    <IonLabel>
                      Importação: {movimentacaoImportacao.criado_em}
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
