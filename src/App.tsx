import React from 'react';
import { IonApp } from '@ionic/react';

import { menuController } from '@ionic/core';
import AlertErro from './components/AlertErro';

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
import Routes from './Routes';

interface AppState {
  logado: boolean;
  organizacaoSelecionada: boolean;
}

interface AuthContextInterface {
  logado: boolean;
  organizacaoSelecionada: boolean;
  toggleLogado: () => void;
  toggleEmpresaSelecionada: () => void;
}

export const AuthContext = React.createContext<AuthContextInterface>({
  logado: !!localStorage.getItem('auth.token'),
  organizacaoSelecionada: !!localStorage.getItem('auth.organizacao.hash'),
  toggleLogado: () => null,
  toggleEmpresaSelecionada: () => null,
});

export default class App extends React.Component<
  Record<string, unknown>,
  AppState
> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      logado: !!localStorage.getItem('auth.token'),
      organizacaoSelecionada: !!localStorage.getItem('auth.organizacao.hash'),
    };
  }

  openMenu = (): Promise<boolean> => {
    return menuController.open();
  };

  toggleLogado = (): void => {
    const { logado } = this.state;
    this.setState({
      logado: !logado,
    });
  };

  toggleEmpresaSelecionada = (): void => {
    const { organizacaoSelecionada } = this.state;
    this.setState({
      organizacaoSelecionada: !organizacaoSelecionada,
    });
  };

  render(): JSX.Element {
    const { logado, organizacaoSelecionada } = this.state;

    return (
      <IonApp>
        <AuthContext.Provider
          value={{
            logado,
            organizacaoSelecionada,
            toggleLogado: this.toggleLogado,
            toggleEmpresaSelecionada: this.toggleEmpresaSelecionada,
          }}
        >
          <Routes />
          <AlertErro />
        </AuthContext.Provider>
      </IonApp>
    );
  }
}
