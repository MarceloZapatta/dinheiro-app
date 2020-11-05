import React from 'react';
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonButton,
  IonLabel,
  IonText,
} from '@ionic/react';

import './Login.css';

import Header from '../../components/Header';

import Dinheiro from '../../services/Dinheiro';
import store from '../../store';

import { setMessage, setShow } from '../../store/reducers/alertErroReducer';

interface LoginState {
  email: string;
  password: string;
  emailInvalido: boolean;
  passwordInvalido: boolean;
}

export default class Login extends React.Component<any, LoginState> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      email: '',
      emailInvalido: false,
      password: '',
      passwordInvalido: false,
    };
  }

  login(): boolean {
    if (!this.validarCampos()) {
      store.dispatch(setMessage('Campos inválidos!'));
      store.dispatch(setShow(true));
      return false;
    }

    const { email, password } = this.state;

    // FETCH NA API
    const dinheiro = new Dinheiro();

    dinheiro.login(email, password).then((response) => {
      const { history } = this.props;

      if (response.sucesso !== true) {
        return false;
      }

      history.push('/movimentacoes');

      return true;
    });

    return true;
  }

  validarCampos(): boolean {
    const { email, password } = this.state;

    this.setState({
      emailInvalido: false,
      passwordInvalido: false,
    });

    const emailRegex = /\S+@\S+/;

    if (!email) {
      this.setState({
        emailInvalido: true,
      });

      return false;
    }

    if (!emailRegex.test(email)) {
      this.setState({
        emailInvalido: true,
      });

      return false;
    }

    if (!password) {
      this.setState({
        passwordInvalido: true,
      });

      return false;
    }

    return true;
  }

  renderEmailInvalido(): JSX.Element {
    const { emailInvalido } = this.state;

    if (emailInvalido) {
      return (
        <IonText color="danger" data-testid="email-invalido-text">
          <p>E-mail inválido.</p>
        </IonText>
      );
    }

    return <span />;
  }

  renderPasswordInvalido(): JSX.Element {
    const { passwordInvalido } = this.state;

    if (passwordInvalido) {
      return (
        <IonText color="danger" data-testid="password-invalido-text">
          <p>Senha inválida.</p>
        </IonText>
      );
    }

    return <span />;
  }

  render(): JSX.Element {
    return (
      <IonPage data-testid="login-page">
        <Header titulo="Entrar" disableBackButton />
        <IonContent>
          <IonGrid>
            <IonRow class="ion-margin-top">
              <IonCol size-lg="4" offset-lg="4">
                <IonItem>
                  <IonLabel position="floating">E-mail</IonLabel>
                  <IonInput
                    type="email"
                    title="E-mail"
                    data-testid="email-input"
                    onIonChange={(e) =>
                      this.setState({
                        email: e.detail.value ?? '',
                      })
                    }
                  />
                </IonItem>
                {this.renderEmailInvalido()}
                <IonItem class="ion-margin-bottom">
                  <IonLabel position="floating">Senha</IonLabel>
                  <IonInput
                    type="password"
                    title="Senha"
                    data-testid="senha-input"
                    onIonChange={(e) =>
                      this.setState({
                        password: e.detail.value ?? '',
                      })
                    }
                  />
                </IonItem>
                {this.renderPasswordInvalido()}
                <IonButton
                  title="Entrar"
                  expand="block"
                  data-testid="entrar-button"
                  onClick={() => this.login()}
                >
                  Entrar
                </IonButton>
                <IonButton expand="block" color="secondary">
                  Registrar
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  }
}
