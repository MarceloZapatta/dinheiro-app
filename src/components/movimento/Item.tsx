import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { format } from 'date-fns';

import Movimento from '../../model/Movimento';

interface ItemProps {
  movimento: Movimento;
}

function Item(props: ItemProps): JSX.Element {
  const { movimento } = props;

  return (
    <IonItem>
      <IonLabel color="medium">{format(movimento.data, 'dd/MM')}</IonLabel>
      <IonLabel>{movimento.descricao}</IonLabel>
      <IonItem lines="none" slot="end">
        <IonLabel color="danger">
          -{' '}
          {Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(movimento.valor)}
        </IonLabel>
      </IonItem>
    </IonItem>
  );
}

export default Item;
