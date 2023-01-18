import React, { useContext, useEffect, useState } from 'react';
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
  IonSpinner,
} from '@ionic/react';

import './Login.css';

import { useHistory } from 'react-router';
import Header from '../../components/Header';

import Dinheiro from '../../services/DinheiroService';
import store from '../../store';
import { setShow } from '../../store/reducers/alertErroReducer';
import { AuthContext } from '../../App';

export default function Login(): JSX.Element {
  const [email, setEmail] = useState<string>();
  const [emailInvalido, setEmailInvalido] = useState(false);
  const [recuperarSenhaError, setRecuperarSenhaError] = useState('');
  const [password, setPassword] = useState<string>();
  const [recuperarSenhaLoading, setRecuperarSenhaLoading] = useState(false);
  const [passwordInvalido, setPasswordInvalido] = useState(false);
  const history = useHistory();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    mostrarMensagens();
  }, []);

  function mostrarMensagens(): void {
    const urlSearchParams = new URLSearchParams(history.location.search);
    const sucesso = urlSearchParams.get('sucesso');
    const erro = urlSearchParams.get('erro');

    if (sucesso) {
      store.dispatch(
        setShow({
          show: true,
          titulo: 'Sucesso!',
          mensagem: sucesso,
        })
      );
    }

    if (erro) {
      store.dispatch(
        setShow({
          show: true,
          mensagem: erro,
        })
      );
    }
  }

  function login(): boolean {
    if (!validarCampos()) {
      store.dispatch(
        setShow({
          show: true,
          mensagem: 'Campos inválidos!',
        })
      );
      return false;
    }

    const dinheiro = new Dinheiro();

    dinheiro.login(String(email), String(password)).then((response) => {
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

      localStorage.setItem('auth.token', String(response.data.access_token));
      authContext.toggleLogado();

      const conviteToken = localStorage.getItem('organizacoes.convite.token');

      if (localStorage.getItem('organizacoes.convite.token')) {
        history.push(`/organizacoes/convite/${conviteToken}`);
      } else {
        history.push('/movimentacoes');
      }

      return true;
    });

    return true;
  }

  function validarCampos(): boolean {
    setEmailInvalido(false);
    setPasswordInvalido(false);

    const emailRegex = /\S+@\S+/;

    if (!email) {
      setEmailInvalido(true);
      return false;
    }

    if (!emailRegex.test(email)) {
      setEmailInvalido(false);
      return false;
    }

    if (!password) {
      setPasswordInvalido(false);
      return false;
    }

    return true;
  }

  function renderEmailInvalido(): JSX.Element {
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

  function renderRecuperarSenhaError(): JSX.Element {
    if (recuperarSenhaError) {
      return (
        <IonItem>
          <IonText color="danger" data-testid="email-invalido-text">
            <small>{recuperarSenhaError}</small>
          </IonText>
        </IonItem>
      );
    }

    return <span />;
  }

  function renderPasswordInvalido(): JSX.Element {
    if (passwordInvalido) {
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

  function handleOnClickEsqueciASenha() {
    if (!email) {
      return setRecuperarSenhaError(
        'Preencha o e-mail para recuperar a senha!'
      );
    }

    const emailRegex = /\S+@\S+/;

    if (!emailRegex.test(email)) {
      return setRecuperarSenhaError('O e-mail é inválido.');
    }

    setRecuperarSenhaError('');

    const dinheiro = new Dinheiro();

    setRecuperarSenhaLoading(true);

    return dinheiro
      .esqueciSenha({ email })
      .then(() => {
        store.dispatch(
          setShow({
            show: true,
            titulo: 'Sucesso!',
            mensagem:
              'Confira as instruções em seu e-mail para recuperar a senha.',
          })
        );
      })
      .finally(() => setRecuperarSenhaLoading(false))
      .catch(() => setRecuperarSenhaLoading(false));
  }

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
                  color={emailInvalido ? 'danger' : ''}
                  data-testid="email-input"
                  autocomplete="off"
                  onIonChange={(e) => setEmail(String(e.detail.value))}
                />
              </IonItem>
              {renderEmailInvalido()}
              {renderRecuperarSenhaError()}
              <IonItem class="ion-margin-bottom">
                <IonLabel position="floating">Senha</IonLabel>
                <IonInput
                  type="password"
                  title="Senha"
                  color={emailInvalido ? 'danger' : ''}
                  data-testid="senha-input"
                  autocomplete="off"
                  onIonChange={(e) => setPassword(String(e.detail.value))}
                />
              </IonItem>
              {renderPasswordInvalido()}
              <IonButton
                title="Entrar"
                expand="block"
                data-testid="entrar-button"
                onClick={() => login()}
              >
                Entrar
              </IonButton>
              <IonButton
                title="Esqueci a senha"
                expand="block"
                fill="clear"
                onClick={() => handleOnClickEsqueciASenha()}
              >
                {recuperarSenhaLoading ? (
                  <IonSpinner color="primary" />
                ) : (
                  'Esqueci a senha'
                )}
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
