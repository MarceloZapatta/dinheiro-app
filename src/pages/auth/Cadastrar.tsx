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
import { RouteComponentProps } from 'react-router';
import Header from '../../components/Header';
import Dinheiro from '../../services/Dinheiro';
import store from '../../store';
import { setShow } from '../../store/reducers/alertErroReducer';

interface CadastrarState {
  email: string;
  senha: string;
  nome: string;
  emailInvalido: boolean;
  senhaInvalida: boolean;
  nomeInvalido: boolean;
  emailJaUtilizado: boolean;
}

interface CadastrarProps {
  history: RouteComponentProps['history'];
}

export default class Cadastrar extends React.Component<
  CadastrarProps,
  CadastrarState
> {
  constructor(props: CadastrarProps) {
    super(props);

    this.state = {
      email: '',
      senha: '',
      nome: '',
      emailInvalido: false,
      senhaInvalida: false,
      nomeInvalido: false,
      emailJaUtilizado: false,
    };
  }

  cadastrar(): boolean {
    const { email, senha, nome } = this.state;

    this.setState({
      emailInvalido: false,
      emailJaUtilizado: false,
      senhaInvalida: false,
    });

    if (!this.validarCampos()) {
      store.dispatch(
        setShow({
          show: true,
          mensagem: 'Campos inválidos!',
        })
      );

      return false;
    }

    const dinheiro = new Dinheiro();

    dinheiro.cadastrar(nome, email, senha).then((response) => {
      const { history } = this.props;

      if (response.sucesso !== true) {
        if (response.mensagem === 'Network request failed') {
          response.mensagem = 'Erro de conexão. Tente novamente mais tarde.';
        }

        if (response.status_codigo === 422 && response.erros) {
          if (Object.keys(response.erros).length > 0) {
            if ('email' in response.erros) {
              if (
                response.erros[Object.keys(response.erros)[0]][0] ===
                'O valor informado para o campo e-mail já está em uso.'
              ) {
                return this.setState({
                  emailJaUtilizado: true,
                });
              }

              return this.setState({
                emailInvalido: true,
              });
            }

            if ('senha' in response.erros) {
              return this.setState({
                senhaInvalida: true,
              });
            }
          }

          return store.dispatch(
            setShow({
              show: true,
              mensagem: response.mensagem,
            })
          );
        }

        store.dispatch(
          setShow({
            show: true,
            mensagem: response.mensagem,
          })
        );

        return false;
      }

      history.push('/verificacao-email');

      return true;
    });

    return true;
  }

  validarCampos(): boolean {
    const { nome, email, senha } = this.state;

    this.setState({
      nomeInvalido: false,
      emailInvalido: false,
      senhaInvalida: false,
    });

    if (!nome) {
      this.setState({
        nomeInvalido: true,
      });

      return false;
    }

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

    if (!senha) {
      this.setState({
        senhaInvalida: true,
      });

      return false;
    }

    return true;
  }

  renderNomeInvalido(): JSX.Element {
    const { nomeInvalido } = this.state;

    if (nomeInvalido) {
      return (
        <IonItem>
          <IonText color="danger" data-testid="nome-invalido-text">
            <p>Nome inválido.</p>
          </IonText>
        </IonItem>
      );
    }

    return <span />;
  }

  renderEmailInvalido(): JSX.Element {
    const { emailInvalido, emailJaUtilizado } = this.state;

    if (emailJaUtilizado) {
      return (
        <IonItem>
          <IonText color="danger" data-testid="email-ja-utilizado-text">
            <small>O e-mail já foi utilizado.</small>
          </IonText>
        </IonItem>
      );
    }

    if (emailInvalido) {
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

  renderSenhaInvalido(): JSX.Element {
    const { senhaInvalida } = this.state;

    if (senhaInvalida) {
      return (
        <IonItem>
          <IonText color="danger" data-testid="senha-invalido-text">
            <p>Senha inválida.</p>
          </IonText>
        </IonItem>
      );
    }

    return <span />;
  }

  render(): JSX.Element {
    const { emailInvalido, senhaInvalida, nomeInvalido } = this.state;

    return (
      <IonPage data-testid="cadastrar-page">
        <Header titulo="Cadastrar" disableBackButton />
        <IonContent>
          <IonGrid>
            <IonRow class="ion-margin-top">
              <IonCol size-lg="4" offset-lg="4" size-md="8" offset-md="2">
                <IonItem>
                  <IonLabel position="floating">Nome</IonLabel>
                  <IonInput
                    type="text"
                    title="Nome"
                    color={nomeInvalido ? 'danger' : ''}
                    data-testid="nome-input"
                    onIonChange={(e) =>
                      this.setState({
                        nome: String(e.detail.value),
                      })
                    }
                  />
                </IonItem>
                {this.renderNomeInvalido()}
                <IonItem>
                  <IonLabel position="floating">E-mail</IonLabel>
                  <IonInput
                    type="email"
                    title="E-mail"
                    color={emailInvalido ? 'danger' : ''}
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
                    color={senhaInvalida ? 'danger' : ''}
                    data-testid="senha-input"
                    onIonChange={(e) =>
                      this.setState({
                        senha: String(e.detail.value),
                      })
                    }
                  />
                </IonItem>
                {this.renderSenhaInvalido()}
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
                    data-testid="possui-conta-button"
                  >
                    Já possui conta? Entrar!
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
