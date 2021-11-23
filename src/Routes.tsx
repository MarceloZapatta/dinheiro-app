import {
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  barChart,
  cashOutline,
  fileTrayFull,
  menuOutline,
  peopleSharp,
  wallet,
} from 'ionicons/icons';
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
import OrganizacaoSelecionar from './pages/organizacoes/OrganizacaoSelecionar';
import OrganizacaoPerfilEditar from './pages/organizacoes/OrganizacaoPerfil';
import OrganizacaoConvite from './pages/organizacoes/OrganizacaoConvite';
import OrganizacaoAdicionar from './pages/organizacoes/OrganizacaoAdicionar';
import OrganizacaoIntegracoes from './pages/organizacoes/integracoes/OrganizacaoIntegracoes';
import Clientes from './pages/clientes/Clientes';
import ClientesAdicionar from './pages/clientes/ClientesAdicionar';
import ClientesEditar from './pages/clientes/ClientesEditar';
import Relatorios from './pages/relatorios/Relatorios';
import ImportacoesEditar from './pages/movimentacoes/importacoes/ImportacoesEditar';
import Importacoes from './pages/movimentacoes/importacoes/Importacoes';
import RecuperarSenha from './pages/auth/RecuperarSenha';

export function MainRoutes(): JSX.Element {
  const authContext = useContext(AuthContext);

  return (
    <>
      <Menu />
      <PrivateRoute exact path="/organizacoes/selecionar">
        <OrganizacaoSelecionar />
      </PrivateRoute>
      <PrivateRoute exact path="/organizacoes/perfil">
        <OrganizacaoPerfilEditar />
      </PrivateRoute>
      <PrivateRoute exact path="/organizacoes/adicionar">
        <OrganizacaoAdicionar />
      </PrivateRoute>
      <PrivateRoute exact path="/organizacoes/integracoes">
        <OrganizacaoIntegracoes />
      </PrivateRoute>
      <Route exact path="/organizacoes/convite/:token">
        <OrganizacaoConvite />
      </Route>
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
      <PrivateRoute path="/movimentacoes/importacoes" exact>
        <Importacoes />
      </PrivateRoute>
      <PrivateRoute path="/movimentacoes/importacoes/:id" exact>
        <ImportacoesEditar />
      </PrivateRoute>
      <PrivateRoute path="/movimentacoes/editar/:id" exact>
        <MovimentacoesEditar />
      </PrivateRoute>
      <PrivateRoute exact path="/clientes">
        <Clientes />
      </PrivateRoute>
      <PrivateRoute path="/clientes/adicionar" exact>
        <ClientesAdicionar />
      </PrivateRoute>
      <PrivateRoute path="/clientes/editar/:id" exact>
        <ClientesEditar />
      </PrivateRoute>
      <PrivateRoute exact path="/relatorios">
        <Relatorios />
      </PrivateRoute>
      <Route
        exact
        path="/"
        render={() =>
          authContext.logado ? <Redirect to="/movimentacoes" /> : <Login />
        }
      />
      <Route exact path="/recuperar-senha/:token" component={RecuperarSenha} />
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
            <IonTabButton tab="clientes" href="/clientes">
              <IonIcon icon={peopleSharp} />
            </IonTabButton>
            <IonTabButton tab="contas" href="/contas">
              <IonIcon icon={wallet} />
            </IonTabButton>
            <IonTabButton tab="categorias" href="/categorias">
              <IonIcon icon={fileTrayFull} />
            </IonTabButton>
            <IonTabButton tab="relatorios" href="/relatorios">
              <IonIcon icon={barChart} />
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
