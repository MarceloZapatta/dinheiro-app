import React from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonLabel,
  IonFooter,
  IonToolbar,
  IonButton,
  IonIcon,
  IonDatetime,
} from '@ionic/react';

import './MovimentacoesAdicionar.css';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import { addOutline } from 'ionicons/icons';

interface StateInterface {
  valor: number;
  valorFormatado: string;
}

export default class MovimentacoesAdicionar extends React.Component<
  {},
  StateInterface
> {
  constructor(props: any) {
    super(props);

    this.state = {
      valor: 0.0,
      valorFormatado: 'R$ 0,00',
    };
  }

  handleCurrencyInput(e: KeyboardEvent) {
    e.preventDefault();

    const keyEntered = e.key;
    const keyCodEntered = e.keyCode;
    const keyCodeBackspace = 8;
    const keyCodeDelete = 46;

    let valorNovo = this.state.valor;

    if (keyCodEntered === keyCodeBackspace || keyCodEntered === keyCodeDelete) {
      valorNovo /= 10;
      let valorString = valorNovo.toFixed(2);
      valorNovo = Number(valorString);
    } else {
      if (isNaN(Number(keyEntered))) {
        return;
      }

      valorNovo *= 10;
      const valorDecimal = Number(keyEntered) / 100;
      valorNovo = Number(valorNovo.toFixed(2)) + valorDecimal;
      valorNovo = Number(valorNovo.toFixed(2));
    }

    valorNovo = Math.abs(valorNovo);

    let valorFormatadoNovo = this.formatMoney(valorNovo);

    this.setState({
      valor: valorNovo,
      valorFormatado: valorFormatadoNovo,
    });
    return;
  }

  formatMoney(valorNumerico: number) {
    return Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
    }).format(valorNumerico);
  }

  render() {
    return (
      <IonPage>
        <Header titulo="Adicionar"></Header>
        <IonContent>
          <IonList>
            <IonItem>
              <IonLabel position="floating">Data</IonLabel>
              <IonDatetime
                max="2200"
                min="1900"
                displayFormat="DD/MM/YYYY"
              ></IonDatetime>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Descrição</IonLabel>
              <IonInput></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Valor</IonLabel>
              <IonInput
                type="text"
                value={this.state.valorFormatado}
                onKeyDown={(e) => this.handleCurrencyInput(e.nativeEvent)}
              ></IonInput>
            </IonItem>
          </IonList>
        </IonContent>
        <IonFooter>
          <IonToolbar class="ion-text-center">
            <Link color="primary" to={'/movimentacoes/adicionar'}>
              <IonButton fill="clear">
                <IonIcon icon={addOutline}></IonIcon>
                Adicionar
              </IonButton>
            </Link>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  }
}
