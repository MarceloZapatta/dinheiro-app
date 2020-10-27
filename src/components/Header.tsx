import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonRow,
  IonCol,
  IonTitle,
} from '@ionic/react';

interface HeaderProps {
  titulo: string;
  defaultHref?: string;
}

function Header(props: HeaderProps) {
  const { defaultHref, titulo } = props;
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref={defaultHref} />
        </IonButtons>
        <IonRow>
          <IonCol size-lg="6" offset-lg="3">
            <IonTitle color="primary">{titulo}</IonTitle>
          </IonCol>
        </IonRow>
      </IonToolbar>
    </IonHeader>
  );
}

Header.defaultProps = {
  defaultHref: '',
};

export default Header;
