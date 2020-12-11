import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRouterLink,
  IonRow,
  IonText,
} from '@ionic/react';
import React from 'react';
import Header from '../../components/Header';

interface CadastrarState {
  email: string;
  password: string;
  nome: string;
  emailInvalido: boolean;
  passwordInvalido: boolean;
  nomeInvalido: boolean;
}

export default class Cadastrar extends React.Component<any, CadastrarState> {
  constructor(props: any) {
    super(props);

    this.state = {
      email: '',
      password: '',
      nome: '',
      emailInvalido: false,
      passwordInvalido: false,
      nomeInvalido: false,
    };
  }

  cadastrar(): string {
    const { email, password, nome } = this.state;
    return email + password + nome;
  }

  isNomeInvalido(): boolean {
    const { nomeInvalido } = this.state;

    return nomeInvalido;
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
        <Header titulo="Cadastrar" disableBackButton />
        <IonContent>
          <IonGrid>
            <IonRow class="ion-margin-top">
              <IonCol size-lg="4" offset-lg="4">
                <IonItem>
                  <IonLabel position="floating">Nome</IonLabel>
                  <IonInput
                    type="text"
                    title="Nome"
                    color={this.isNomeInvalido() ? 'danger' : ''}
                    data-testid="nome-input"
                    onIonChange={(e) =>
                      this.setState({
                        nome: String(e.detail.value),
                      })
                    }
                  />
                </IonItem>
                {this.renderPasswordInvalido()}
                <IonItem>
                  <IonLabel position="floating">E-mail</IonLabel>
                  <IonInput
                    type="email"
                    title="E-mail"
                    color={this.isEmailInvalido() ? 'danger' : ''}
                    data-testid="email-input"
                    autofocus
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
                  title="Cadastrar"
                  expand="block"
                  data-testid="cadastrar-button"
                  onClick={() => this.cadastrar()}
                >
                  Cadastrar
                </IonButton>
                <IonRouterLink routerLink="/">
                  <IonButton
                    title="Cadastrar"
                    expand="block"
                    fill="clear"
                    data-testid="cadastrar-button"
                  >
                    Já possui conta? Entrar aqui!
                  </IonButton>
                </IonRouterLink>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  }
}
