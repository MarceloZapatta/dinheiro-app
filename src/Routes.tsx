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
import {
  Redirect,
  // Redirect,
  Route,
} from 'react-router';
import { AuthContext } from './App';
import Cadastrar from './pages/auth/Cadastrar';
import Login from './pages/auth/Login';
import VerificacaoEmailEnviado from './pages/auth/VerificacaoEmailEnviado';
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
        {authContext.logado ? (
          <>
            <Route
              exact
              path="/selecionar-organizacao"
              component={SelecionarOrganizacao}
            />
            {authContext.logado && !authContext.organizacaoSelecionada ? (
              <Redirect to="/selecionar-organizacao" />
            ) : (
              <>
                <Route
                  path="/verificacao-email"
                  component={VerificacaoEmailEnviado}
                />
                <Route exact path="/movimentacoes" component={Movimentacoes} />
                <Route exact path="/cadastrar" component={Cadastrar} />
                <Route
                  path="/movimentacoes/adicionar"
                  component={MovimentacoesAdicionar}
                  exact
                />
                <Redirect to="/movimentacoes" />
              </>
            )}
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
          </>
        ) : (
          <>
            <Route exact path="/" component={Login} />
            <Redirect to="/" />
          </>
        )}
      </IonRouterOutlet>
    </IonReactRouter>
  );
}
