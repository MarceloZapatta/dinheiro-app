import {
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cashOutline, fileTrayFull, menuOutline, wallet } from 'ionicons/icons';
import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router';
import { menuController } from '@ionic/core';
import Menu from './components/menu/Menu';
import { AuthContext } from './App';
import PrivateRoute from './components/routes/PrivateRoute';
import Cadastrar from './pages/auth/Cadastrar';
import Login from './pages/auth/Login';
import VerificacaoEmailEnviado from './pages/auth/VerificacaoEmailEnviado';
import Categorias from './pages/categorias/Categorias';
import CategoriasAdicionar from './pages/categorias/CategoriasAdicionar';
import CategoriasEditar from './pages/categorias/CategoriasEditar';
import Contas from './pages/contas/Contas';
import ContasAdicionar from './pages/contas/ContasAdicionar';
import ContasEditar from './pages/contas/ContasEditar';
import Movimentacoes from './pages/movimentacoes/Movimentacoes';
import MovimentacoesAdicionar from './pages/movimentacoes/MovimentacoesAdicionar';
import MovimentacoesEditar from './pages/movimentacoes/MovimentacoesEditar';
import SelecionarOrganizacao from './pages/selecionar-organizacao/SelecionarOrganizacao';

export function MainRoutes(): JSX.Element {
  const authContext = useContext(AuthContext);

  return (
    <>
      <Menu />
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
      <PrivateRoute exact path="/categorias">
        <Categorias />
      </PrivateRoute>
      <PrivateRoute exact path="/categorias/adicionar">
        <CategoriasAdicionar />
      </PrivateRoute>
      <PrivateRoute exact path="/categorias/editar/:id">
        <CategoriasEditar />
      </PrivateRoute>
      <PrivateRoute exact path="/movimentacoes">
        <Movimentacoes />
      </PrivateRoute>
      <PrivateRoute path="/movimentacoes/adicionar" exact>
        <MovimentacoesAdicionar />
      </PrivateRoute>
      <PrivateRoute path="/movimentacoes/editar/:id" exact>
        <MovimentacoesEditar />
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

  function handleOnTabsWillChange(e: any) {
    if (e.detail.tab === 'menu') {
      menuController.toggle();
    }
  }

  return (
    <IonReactRouter>
      {authContext.logado && authContext.organizacaoSelecionada ? (
        <IonTabs>
          <IonRouterOutlet id="menu">
            <MainRoutes />
          </IonRouterOutlet>
          <IonTabBar
            slot="bottom"
            onIonTabsWillChange={(e) => handleOnTabsWillChange(e)}
          >
            <IonTabButton tab="menu">
              <IonIcon icon={menuOutline} />
            </IonTabButton>
            <IonTabButton tab="movimentacoes" href="/movimentacoes">
              <IonIcon icon={cashOutline} />
            </IonTabButton>
            <IonTabButton tab="contas" href="/contas">
              <IonIcon icon={wallet} />
            </IonTabButton>
            <IonTabButton tab="categorias" href="/categorias">
              <IonIcon icon={fileTrayFull} />
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
