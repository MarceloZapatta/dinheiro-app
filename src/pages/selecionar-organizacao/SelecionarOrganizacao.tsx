import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonButton,
} from '@ionic/react';

import './SelecionarOrganizacao.scss';

import Header from '../../components/Header';
import { AuthContext } from '../../App';

import Dinheiro, {
  Organizacao,
  OrganizacaoResponse,
} from '../../services/DinheiroService';

export default function SelecionarOrganizacao(): JSX.Element {
  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>();
  const history = useHistory();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchOrganizacoes();
  }, []);

  async function fetchOrganizacoes() {
    const dinheiro = new Dinheiro();
    const response: OrganizacaoResponse = await dinheiro.getOrganizacoes();
    setOrganizacoes(response.data);
  }

  function selecionarOrganizacao(hash: string) {
    localStorage.setItem('auth.organizacao.hash', hash);
    if (!authContext.organizacaoSelecionada) {
      authContext.toggleOrganizacaoSelecionada();
    }
    history.push(`/movimentacoes`);
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Selecionar organização" disableBackButton />
      <IonContent>
        <IonGrid>
          <IonRow class="ion-margin-top">
            <IonCol size-lg="4" offset-lg="4" size-md="8" offset-md="2">
              <IonRow>
                {organizacoes &&
                  organizacoes.map((organizacao) => (
                    <IonCol key={organizacao.hash}>
                      <IonCard>
                        <IonCardHeader>
                          <IonCardTitle>{organizacao.nome}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                          <IonButton
                            onClick={() =>
                              selecionarOrganizacao(organizacao.hash)
                            }
                          >
                            Acessar
                          </IonButton>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  ))}
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
