import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
} from '@ionic/react';
import {
  exitOutline,
  peopleOutline,
  swapHorizontalOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router';
import { menuController } from '@ionic/core';

export default function Menu(): JSX.Element {
  const history = useHistory();
  function handleClick(route: string) {
    if (route === '/sair') {
      localStorage.clear();
      return history.push('/');
    }

    history.push(route);
    return menuController.close();
  }

  return (
    <IonMenu side="start" contentId="menu">
      <IonHeader>
        <IonToolbar>
          <IonTitle color="primary">Poupis</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem
            button
            onClick={() => handleClick('/organizacoes/selecionar')}
          >
            <IonIcon icon={swapHorizontalOutline} slot="start" />
            Trocar organização
          </IonItem>
          <IonItem button onClick={() => handleClick('/organizacoes/perfil')}>
            <IonIcon icon={peopleOutline} slot="start" />
            Perfil da organização
          </IonItem>
          <IonItem button onClick={() => handleClick('/sair')}>
            <IonIcon icon={exitOutline} slot="start" />
            Sair
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
}
