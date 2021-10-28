import {
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cashOutline, wallet } from 'ionicons/icons';
import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router';
import { AuthContext } from './App';
import PrivateRoute from './components/routes/PrivateRoute';
import Cadastrar from './pages/auth/Cadastrar';
import Login from './pages/auth/Login';
import VerificacaoEmailEnviado from './pages/auth/VerificacaoEmailEnviado';
import Contas from './pages/contas/Contas';
import ContasAdicionar from './pages/contas/ContasAdicionar';
import ContasEditar from './pages/contas/ContasEditar';
import Movimentacoes from './pages/movimentacoes/Movimentacoes';
import MovimentacoesAdicionar from './pages/movimentacoes/MovimentacoesAdicionar';
import SelecionarOrganizacao from './pages/selecionar-organizacao/SelecionarOrganizacao';

export function MainRoutes(): JSX.Element {
  const authContext = useContext(AuthContext);

  return (
    <>
      <PrivateRoute exact path="/selecionar-organizacao">
        <SelecionarOrganizacao />
      </PrivateRoute>
      <PrivateRoute exact path="/contas">
        <Contas />
      </PrivateRoute>
      <PrivateRoute exact path="/contas/adicionar">
        <ContasAdicionar />
      </PrivateRoute>
      <PrivateRoute exact path="/contas/editar/:id">
        <ContasEditar />
      </PrivateRoute>
      <PrivateRoute exact path="/movimentacoes">
        <Movimentacoes />
      </PrivateRoute>
      <PrivateRoute path="/movimentacoes/adicionar" exact>
        <MovimentacoesAdicionar />
      </PrivateRoute>
      <Route
        exact
        path="/"
        render={() =>
          authContext.logado ? <Redirect to="/movimentacoes" /> : <Login />
        }
      />
      <Route exact path="/cadastrar" component={Cadastrar} />
      <Route path="/verificacao-email" component={VerificacaoEmailEnviado} />
    </>
  );
}

export default function Routes(): JSX.Element {
  const authContext = useContext(AuthContext);
  return (
    <IonReactRouter>
      {authContext.logado && authContext.organizacaoSelecionada ? (
        <IonTabs>
          <IonRouterOutlet>
            <MainRoutes />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="movimentacoes" href="/movimentacoes">
              <IonIcon icon={cashOutline} />
            </IonTabButton>
            <IonTabButton tab="contas" href="/contas">
              <IonIcon icon={wallet} />
            </IonTabButton>
            {/* <IonTabButton onClick={() => openMenu()}>
              <IonIcon icon={menu} onClick={() => openMenu()} />
            </IonTabButton> */}
          </IonTabBar>
        </IonTabs>
      ) : (
        <IonRouterOutlet>
          <MainRoutes />
        </IonRouterOutlet>
      )}
    </IonReactRouter>
  );
}
