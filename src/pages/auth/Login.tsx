import React from 'react';
import {
  IonContent,
  IonPage,
  IonToolbar,
  IonRow,
  IonCol,
  IonFooter,
  IonButton,
  IonIcon,
  IonGrid,
} from '@ionic/react';

import { addOutline } from 'ionicons/icons';

import './Login.css';
import { Link } from 'react-router-dom';

import Header from '../../components/Header';

export default function Login() {
  return (
    <IonPage>
      <Header titulo="Login" />
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size-lg="6" offset-lg="3" />
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonToolbar class="ion-text-center">
          <Link color="primary" to="/movimentacoes/adicionar">
            <IonButton fill="clear">
              <IonIcon icon={addOutline} />
              Adicionar
            </IonButton>
          </Link>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}
