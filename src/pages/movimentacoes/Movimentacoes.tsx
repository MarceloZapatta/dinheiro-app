import React from 'react';
import {
  IonContent,
  IonPage,
  IonToolbar,
  IonRow,
  IonCol,
  IonList,
  IonFooter,
  IonButton,
  IonIcon,
  IonGrid,
} from '@ionic/react';

import { addOutline } from 'ionicons/icons';

import './Movimentacoes.css';
import { Link } from 'react-router-dom';

import Header from '../../components/Header';
import Item from '../../components/movimento/Item';
import Movimento from '../../model/Movimento';

class Movimentacoes extends React.Component {
  movimentos = () => {
    const movimentos = [];

    for (let index = 0; index < 10; index += 1) {
      const movimento = new Movimento(
        Number((Math.random() * 1000).toFixed(0)),
        Number((Math.random() * 100).toFixed(2)),
        'UBER',
        new Date()
      );
      movimentos.push(<Item key={movimento.id} movimento={movimento} />);
    }

    return movimentos;
  };

  render() {
    return (
      <IonPage>
        <Header titulo="Movimentações" />
        <IonContent>
          <IonGrid>
            <IonRow>
              <IonCol size-lg="6" offset-lg="3">
                <IonList>{this.movimentos()}</IonList>
              </IonCol>
            </IonRow>
          </IonGrid>
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

export default Movimentacoes;
