import React, { useState, useEffect, useContext } from 'react';
import {
  IonContent,
  IonPage,
  IonRow,
  IonGrid,
  IonCol,
  IonSpinner,
  IonList,
  IonItem,
  IonButtons,
  IonButton,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../../App';
import Header from '../../components/Header';
import DinheiroService from '../../services/DinheiroService';

export default function OrganizacaoConvite(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const { token } = useParams<{ token?: string }>();

  useEffect(() => {
    if (authContext.logado) {
      setLoading(false);
    } else {
      localStorage.setItem('organizacoes.convite.token', String(token));
      history.push('/');
    }
  }, []);

  const handleClickConfirmar = () => {
    setLoading(true);
    const dinheiroService = new DinheiroService();
    dinheiroService
      .aceitarConvite(String(token))
      .then(() => history.push('/organizacoes/selecionar'))
      .finally(() => setLoading(false));
  };

  return (
    <IonPage>
      <Header titulo="Convite para organização" defaultHref="/movimentacoes" />
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
              {loading ? (
                <IonSpinner color="primary" />
              ) : (
                <IonList className="ion-margin-top">
                  <IonItem>Confirmar convite?</IonItem>
                  <IonItem>
                    <IonButtons>
                      <IonButton color="tertiary">Cancelar</IonButton>
                      <IonButton
                        color="primary"
                        onClick={() => handleClickConfirmar()}
                      >
                        Confirmar
                      </IonButton>
                    </IonButtons>
                  </IonItem>
                </IonList>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
