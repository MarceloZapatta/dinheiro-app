import React from 'react';
import { Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonMenu,
  IonContent,
  IonList,
  IonItem,
} from '@ionic/react';

import { menuController } from '@ionic/core';
import { IonReactRouter } from '@ionic/react-router';
import { cashOutline, menu } from 'ionicons/icons';
import Login from './pages/auth/Login';
import AlertErro from './components/AlertErro';
import Movimentacoes from './pages/movimentacoes/Movimentacoes';
import MovimentacoesAdicionar from './pages/movimentacoes/MovimentacoesAdicionar';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Cadastrar from './pages/auth/Cadastrar';
import VerificacaoEmailEnviado from './pages/auth/VerificacaoEmailEnviado';

interface AppState {
  usuario: Record<string, unknown>;
}

export default class App extends React.Component<
  Record<string, unknown>,
  AppState
> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      usuario: {},
    };
  }

  openMenu = (): Promise<boolean> => {
    return menuController.open();
  };

  renderRoutes(): JSX.Element {
    const { usuario } = this.state;

    if (Object.keys(usuario).length > 0) {
      return (
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/movimentacoes" component={Movimentacoes} exact />
            <Route
              path="/movimentacoes/adicionar"
              component={MovimentacoesAdicionar}
              exact
            />
            <Route path="/" component={Login} exact />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="movimentacoes" href="/movimentacoes">
              <IonIcon icon={cashOutline} />
            </IonTabButton>
            <IonTabButton onClick={() => this.openMenu()}>
              <IonIcon icon={menu} onClick={() => this.openMenu()} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      );
    }

    return (
      <IonRouterOutlet>
        <Route path="/cadastrar" component={Cadastrar} exact />
        <Route path="/movimentacoes" component={Movimentacoes} exact />
        <Route
          path="/movimentacoes/adicionar"
          component={MovimentacoesAdicionar}
          exact
        />
        <Route path="/" component={Login} exact />
      </IonRouterOutlet>
    );
  }

  renderMenu(): JSX.Element {
    const { usuario } = this.state;

    if (Object.keys(usuario).length > 0) {
      return (
        <IonMenu side="start" menuId="first" contentId="menu-content">
          <IonContent id="menu-content">
            <IonList>
              <IonItem>Perfil</IonItem>
              <IonItem>Extrato</IonItem>
              <IonItem>Contas</IonItem>
              <IonItem>Menu Item</IonItem>
              <IonItem>Menu Item</IonItem>
            </IonList>
          </IonContent>
        </IonMenu>
      );
    }

    return <span />;
  }

  render(): JSX.Element {
    return (
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/" component={Login} />
            <Route
              path="/verificacao-email/{token}"
              component={VerificacaoEmailEnviado}
            />
            <Route exact path="/movimentacoes" component={Movimentacoes} />
            <Route exact path="/cadastrar" component={Cadastrar} />
            <Route
              path="/movimentacoes/adicionar"
              component={MovimentacoesAdicionar}
              exact
            />
          </IonRouterOutlet>
        </IonReactRouter>
        <AlertErro />
      </IonApp>
    );
  }
}
