import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { format } from 'date-fns';

import Movimento from '../../model/Movimento';

interface ItemProps {
  movimento: Movimento;
}

export default class Item extends React.Component<ItemProps> {
  render() {
    return (
      <IonItem>
        <IonLabel color='medium'>
          {format(this.props.movimento.data, 'dd/MM')}
        </IonLabel>
        <IonLabel>{this.props.movimento.descricao}</IonLabel>
        <IonItem lines='none' slot='end'>
          <IonLabel color='danger'>
            -{' '}
            {Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(this.props.movimento.valor)}
          </IonLabel>
        </IonItem>
      </IonItem>
    );
  }
}
