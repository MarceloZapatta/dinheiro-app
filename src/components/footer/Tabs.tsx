import { IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { cashOutline } from 'ionicons/icons';
import React from 'react';

export default function Tabs(): JSX.Element {
  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="movimentacoes" href="/movimentacoes">
          <IonIcon icon={cashOutline} />
        </IonTabButton>
        {/* <IonTabButton onClick={() => openMenu()}>
            <IonIcon icon={menu} onClick={() => openMenu()} />
          </IonTabButton> */}
      </IonTabBar>
    </IonTabs>
  );
}
