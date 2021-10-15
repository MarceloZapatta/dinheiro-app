import { IonAlert } from '@ionic/react';
import React from 'react';
import store from '../store';

interface AlertErroState {
  show: boolean;
  header: string;
  mensagem: string;
}

export default class AlertErro extends React.Component<
  Record<string, unknown>,
  AlertErroState
> {
  constructor(props: Record<string, unknown>) {
    super(props);

    const { alertErro } = store.getState();

    this.state = {
      show: alertErro.value.show,
      header: alertErro.value.titulo,
      mensagem: alertErro.value.mensagem,
    };

    store.subscribe(this.handleAlertErroChange.bind(this));
  }

  setShowErrorAlert(state: boolean): void {
    this.setState({
      show: false,
    });
  }

  handleAlertErroChange(): void {
    const { alertErro } = store.getState();
    const { show } = this.state;

    if (show !== alertErro.value.show) {
      this.setState({
        show: alertErro.value.show,
        header: alertErro.value.titulo || 'Erro!',
        mensagem: alertErro.value.mensagem,
      });
    }
  }

  render(): JSX.Element {
    const { show, header, mensagem } = this.state;

    return (
      <IonAlert
        isOpen={show}
        onDidDismiss={() => this.setShowErrorAlert(false)}
        header={header}
        message={mensagem}
        buttons={['OK']}
      />
    );
  }
}
