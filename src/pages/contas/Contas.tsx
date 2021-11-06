import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { addOutline } from 'ionicons/icons';
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

import Header from '../../components/Header';

import Dinheiro, {
  Conta,
  ContasResponse,
} from '../../services/DinheiroService';
import CorIcone from '../../components/cor-icone/CorIcone';
import ButtonAdicionar from '../../components/button-adicionar/ButtonAdicionar';

export default function Contas(): JSX.Element {
  const [contas, setContas] = useState<Conta[]>([]);
  const history = useHistory();

  useEffect(() => {
    fetchContas();
  }, []);

  async function fetchContas() {
    const dinheiro = new Dinheiro();
    const response: ContasResponse = await dinheiro.getContas();
    setContas(response.data);
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Contas" disableBackButton />
      <IonContent>
        <IonGrid>
          <IonRow class="ion-margin-top">
            <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
              <IonList>
                {contas.map((conta) => (
                  <IonItem button routerLink={`/contas/editar/${conta.id}`}>
                    <IonLabel>
                      <CorIcone
                        cor={conta.cor.hexadecimal}
                        icone={conta.icone}
                      />
                    </IonLabel>
                    <IonLabel>{conta.nome}</IonLabel>
                    <IonLabel slot="end" className="ion-text-right">
                      {Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(conta.saldo)}
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <ButtonAdicionar
        action={() => history.push('/contas/adicionar')}
        icon={addOutline}
      />
    </IonPage>
  );
}
