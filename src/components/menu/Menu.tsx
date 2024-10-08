import React, { useContext } from 'react';
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
  gridOutline,
  peopleOutline,
  pushOutline,
  swapHorizontalOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router';
import { menuController } from '@ionic/core';
import { AuthContext } from '../../App';

export default function Menu(): JSX.Element {
  const history = useHistory();
  const authContext = useContext(AuthContext);

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
          {authContext.organizacaoPessoaJuridica && (
            <IonItem
              button
              onClick={() => handleClick('/organizacoes/integracoes')}
            >
              <IonIcon icon={gridOutline} slot="start" />
              Integrações
            </IonItem>
          )}
          <IonItem
            button
            onClick={() => handleClick('/movimentacoes/importacoes')}
          >
            <IonIcon icon={pushOutline} slot="start" />
            Importações
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
