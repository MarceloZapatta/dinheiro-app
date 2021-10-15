import React from 'react';
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  IonButton,
  IonImg,
} from '@ionic/react';
import Header from '../../components/Header';
import mailSvg from '../../assets/img/undraw_message_sent.svg';

const VerificacaoEmailEnviado = function VerificacaoEmailEnviado(): JSX.Element {
  return (
    <IonPage data-testid="login-page">
      <Header titulo="Verificar e-mail" disableBackButton />
      <IonContent>
        <IonGrid>
          <IonRow className="ion-margin-top">
            <IonCol size-lg="4" offset-lg="4" size-md="8" offset-md="2">
              <IonImg src={mailSvg} />
              <p className="ion-padding-top">
                Enviamos um e-mail de verificação de cadastro para sua caixa de
                entrada!
              </p>
              <IonButton
                title="Voltar"
                expand="block"
                fill="clear"
                data-testid="login-button"
                routerLink="/"
              >
                Já verificou a conta? Entrar
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default VerificacaoEmailEnviado;
