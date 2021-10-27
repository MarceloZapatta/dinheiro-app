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
import { Link } from 'react-router-dom';
import { addOutline } from 'ionicons/icons';
import Header from '../../components/Header';

interface StateInterface {
  valor: number;
  valorFormatado: string;
}

export default class MovimentacoesAdicionar extends React.Component<
  unknown,
  StateInterface
> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      valor: 0.0,
      valorFormatado: 'R$ 0,00',
    };
  }

  handleCurrencyInput(e: KeyboardEvent): void {
    e.preventDefault();

    const keyEntered = e.key;
    const keyCodEntered = e.keyCode;
    const keyCodeBackspace = 8;
    const keyCodeDelete = 46;

    const { valor } = this.state;
    let valorNovo = valor;

    if (keyCodEntered === keyCodeBackspace || keyCodEntered === keyCodeDelete) {
      valorNovo /= 10;
      const valorString = valorNovo.toFixed(2);
      valorNovo = Number(valorString);
    } else {
      if (!Number.isNaN(Number(keyEntered))) {
        return;
      }

      valorNovo *= 10;
      const valorDecimal = Number(keyEntered) / 100;
      valorNovo = Number(valorNovo.toFixed(2)) + valorDecimal;
      valorNovo = Number(valorNovo.toFixed(2));
    }

    valorNovo = Math.abs(valorNovo);

    const valorFormatadoNovo = this.formatMoney(valorNovo);

    this.setState({
      valor: valorNovo,
      valorFormatado: valorFormatadoNovo,
    });
  }

  formatMoney = (valorNumerico: number): string => {
    return Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
    }).format(valorNumerico);
  };

  render(): JSX.Element {
    const { valorFormatado } = this.state;

    return (
      <IonPage>
        <Header titulo="Adicionar" />
        <IonContent>
          <IonList>
            <IonItem>
              <IonLabel position="floating">Data</IonLabel>
              <IonDatetime max="2200" min="1900" displayFormat="DD/MM/YYYY" />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Descrição</IonLabel>
              <IonInput />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Valor</IonLabel>
              <IonInput
                type="text"
                value={valorFormatado}
                onKeyDown={(e) => this.handleCurrencyInput(e.nativeEvent)}
              />
            </IonItem>
          </IonList>
        </IonContent>
        <IonFooter>
          <IonToolbar class="ion-text-center">
            <Link color="primary" to="/movimentacoes/adicionar">
              <IonButton fill="clear">
                <IonIcon icon={addOutline} />
                Adicionar
              </IonButton>
            </Link>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  }
}
