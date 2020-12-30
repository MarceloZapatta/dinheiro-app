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

import { setShow } from '../../store/reducers/alertErroReducer';

interface LoginState {
  email: string;
  password: string;
  emailInvalido: boolean;
  passwordInvalido: boolean;
}

export default class Login extends React.Component<any, LoginState> {
  constructor(props: any) {
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
      store.dispatch(
        setShow({
          show: true,
          mensagem: 'Campos inválidos!',
        })
      );
      return false;
    }

    const { email, password } = this.state;

    const dinheiro = new Dinheiro();

    dinheiro.login(email, password).then((response) => {
      const { history } = this.props;

      if (response.sucesso !== true) {
        if (response.mensagem === 'Network request failed') {
          response.mensagem = 'Erro de conexão. Tente novamente mais tarde.';
        }

        store.dispatch(
          setShow({
            show: true,
            mensagem: response.mensagem,
          })
        );

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

  isPasswordInvalido(): boolean {
    const { passwordInvalido } = this.state;

    return passwordInvalido;
  }

  isEmailInvalido(): boolean {
    const { emailInvalido } = this.state;

    return emailInvalido;
  }

  renderEmailInvalido(): JSX.Element {
    if (this.isEmailInvalido()) {
      return (
        <IonItem>
          <IonText color="danger" data-testid="email-invalido-text">
            <small>E-mail inválido.</small>
          </IonText>
        </IonItem>
      );
    }

    return <span />;
  }

  renderPasswordInvalido(): JSX.Element {
    if (this.isPasswordInvalido()) {
      return (
        <IonItem>
          <IonText color="danger" data-testid="password-invalido-text">
            <p>Senha inválida.</p>
          </IonText>
        </IonItem>
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
              <IonCol size-lg="4" offset-lg="4" size-md="8" offset-md="2">
                <IonItem>
                  <IonLabel position="floating">E-mail</IonLabel>
                  <IonInput
                    type="email"
                    title="E-mail"
                    color={this.isEmailInvalido() ? 'danger' : ''}
                    data-testid="email-input"
                    onIonChange={(e) =>
                      this.setState({
                        email: String(e.detail.value),
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
                    color={this.isPasswordInvalido() ? 'danger' : ''}
                    data-testid="senha-input"
                    onIonChange={(e) =>
                      this.setState({
                        password: String(e.detail.value),
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
                <IonButton
                  title="Registrar"
                  expand="block"
                  fill="clear"
                  data-testid="registrar-button"
                  routerLink="/cadastrar"
                >
                  Novo por aqui? Registre-se!
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  }
}
