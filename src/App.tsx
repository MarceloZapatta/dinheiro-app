import React from 'react';
import { Redirect, Route } from 'react-router-dom';
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

export default class App extends React.Component {
  openMenu() {
    return menuController.open();
  }

  render() {
    return (
      <IonApp>
        <IonMenu side='start' menuId='first' contentId='menu-content'>
          <IonContent id='menu-content'>
            <IonList>
              <IonItem>Perfil</IonItem>
              <IonItem>Extrato</IonItem>
              <IonItem>Contas</IonItem>
              <IonItem>Menu Item</IonItem>
              <IonItem>Menu Item</IonItem>
            </IonList>
          </IonContent>
        </IonMenu>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route
                path='/movimentacoes'
                component={Movimentacoes}
                exact={true}
              />
              <Route
                path='/movimentacoes/adicionar'
                component={MovimentacoesAdicionar}
                exact={true}
              />
              <Route
                path='/'
                render={() => <Redirect to='/movimentacoes' />}
                exact={true}
              />
            </IonRouterOutlet>
            <IonTabBar slot='bottom'>
              <IonTabButton tab='movimentacoes' href='/movimentacoes'>
                <IonIcon icon={cashOutline} />
              </IonTabButton>
              <IonTabButton onClick={() => this.openMenu()}>
                <IonIcon icon={menu}  onClick={() => this.openMenu()}/>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    );
  }
}
