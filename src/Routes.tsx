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
        {authContext.logado ? (
          <>
            {authContext.logado && !authContext.organizacaoSelecionada ? (
              <>
                <Route
                  exact
                  path="/selecionar-organizacao"
                  component={SelecionarOrganizacao}
                />
                <Redirect to="selecionar-organizacao" />
              </>
            ) : (
              <>
                <Route exact path="/contas" component={Contas} />
                <Route
                  exact
                  path="/contas/adicionar"
                  component={ContasAdicionar}
                />
                <Route
                  exact
                  path="/contas/editar/:id"
                  component={ContasEditar}
                />
                <Route
                  exact
                  path="/selecionar-organizacao"
                  component={SelecionarOrganizacao}
                />
                <Route exact path="/movimentacoes" component={Movimentacoes} />
                <Route
                  path="/movimentacoes/adicionar"
                  component={MovimentacoesAdicionar}
                  exact
                />
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
            <Route exact path="/cadastrar" component={Cadastrar} />
            <Route
              path="/verificacao-email"
              component={VerificacaoEmailEnviado}
            />
          </>
        )}
      </IonRouterOutlet>
    </IonReactRouter>
  );
}
