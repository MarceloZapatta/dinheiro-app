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
  IonIcon,
} from '@ionic/react';

import './OrganizacaoSelecionar.scss';

import { add } from 'ionicons/icons';
import Header from '../../components/Header';
import { AuthContext } from '../../App';

import Dinheiro, {
  Organizacao,
  OrganizacoesResponse,
} from '../../services/DinheiroService';

export default function OrganizacaoSelecionar(): JSX.Element {
  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>();
  const history = useHistory();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchOrganizacoes();
  }, []);

  async function fetchOrganizacoes() {
    const dinheiro = new Dinheiro();
    const response: OrganizacoesResponse = await dinheiro.getOrganizacoes();
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
            <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
              <IonRow>
                {organizacoes &&
                  organizacoes.map((organizacao) => (
                    <IonCol
                      sizeXs="12"
                      sizeMd="6"
                      sizeLg="6"
                      key={organizacao.hash}
                    >
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
                <IonCol sizeXs="12" sizeMd="6" sizeLg="6" key={-1}>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>Criar nova organização</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonButton
                        onClick={() => history.push('/organizacoes/adicionar')}
                      >
                        <IonIcon icon={add} />
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
