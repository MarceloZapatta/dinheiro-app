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
  disableBackButton?: boolean;
}

function renderBackButton(
  disableBackButton: boolean | undefined,
  defaultHref: string | undefined
): JSX.Element {
  if (disableBackButton) {
    return <span />;
  }

  return (
    <IonButtons slot="start">
      <IonBackButton defaultHref={defaultHref} />
    </IonButtons>
  );
}

function Header(props: HeaderProps): JSX.Element {
  const { defaultHref, titulo, disableBackButton } = props;

  return (
    <IonHeader>
      <IonToolbar>
        {renderBackButton(disableBackButton, defaultHref)}
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
  disableBackButton: false,
};

export default Header;
