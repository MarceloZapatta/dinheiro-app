import React, { useEffect, useState } from 'react';
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

import Header from '../../../components/Header';
import './OrganizacaoIntegracoes.scss';
import Dinheiro, {
  IntegracaoDados,
  IntegracaoDadosResponse,
} from '../../../services/DinheiroService';
import juno from '../../../assets/img/brands/juno.svg';

export default function OrganizacaoIntegracoes(): JSX.Element {
  const [integracaoDados, setIntegracaoDados] = useState<IntegracaoDados[]>();
  const history = useHistory();

  useEffect(() => {
    fetchIntegracoes();
  }, []);

  async function fetchIntegracoes() {
    const dinheiro = new Dinheiro();
    const response: IntegracaoDadosResponse = await dinheiro.getIntegracoes();
    setIntegracaoDados(response.data);
  }

  const integradoJuno = !!integracaoDados?.find(
    (integracaoDado) => integracaoDado.integracao.nome === 'Juno'
  );

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Selecionar organização" disableBackButton />
      <IonContent>
        <IonGrid>
          <IonRow class="ion-margin-top">
            <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
              <IonRow>
                <IonCol sizeXs="12" sizeMd="6" sizeLg="6" key={-1}>
                  <IonCard className="card-integracao">
                    <IonCardHeader>
                      <IonCardTitle>
                        <img src={juno} alt="Juno" width="150" />
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonButton
                        onClick={() =>
                          history.push(
                            '/organizacoes/integracoes/juno/cadastrar'
                          )
                        }
                        disabled={integradoJuno}
                      >
                        {integradoJuno ? 'Cadastrado' : 'Cadastrar dados'}
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
