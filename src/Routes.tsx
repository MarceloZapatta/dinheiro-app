import {
  //   IonIcon,
  IonRouterOutlet,
  //   IonTabBar,
  //   IonTabButton,
  //   IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
// import { cashOutline, menu } from 'ionicons/icons';
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

export default function Routes(): JSX.Element {
  const authContext = useContext(AuthContext);

  //   renderMenu(): JSX.Element {
  //     const { usuario } = this.state;

  //     if (Object.keys(usuario).length > 0) {
  //       return (
  //         <IonMenu side="start" menuId="first" contentId="menu-content">
  //           <IonContent id="menu-content">
  //             <IonList>
  //               <IonItem>Perfil</IonItem>
  //               <IonItem>Extrato</IonItem>
  //               <IonItem>Contas</IonItem>
  //               <IonItem>Menu Item</IonItem>
  //               <IonItem>Menu Item</IonItem>
  //             </IonList>
  //           </IonContent>
  //         </IonMenu>
  //       );
  //     }

  //     return <span />;
  //   }
  return (
    <IonReactRouter>
      <IonRouterOutlet>
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
        <PrivateRoute exact path="/selecionar-organizacao">
          <SelecionarOrganizacao />
        </PrivateRoute>
        {/* <IonTabs>
              <IonTabBar slot="bottom">
                <IonTabButton tab="movimentacoes" href="/movimentacoes">
                  <IonIcon icon={cashOutline} />
                </IonTabButton>
                <IonTabButton onClick={() => this.openMenu()}>
                  <IonIcon icon={menu} onClick={() => this.openMenu()} />
                </IonTabButton>
              </IonTabBar>
            </IonTabs> */}
        <Route
          exact
          path="/"
          render={() =>
            authContext.logado ? <Redirect to="/movimentacoes" /> : <Login />
          }
        />
        <Route exact path="/cadastrar" component={Cadastrar} />
        <Route path="/verificacao-email" component={VerificacaoEmailEnviado} />
      </IonRouterOutlet>
    </IonReactRouter>
  );
}
