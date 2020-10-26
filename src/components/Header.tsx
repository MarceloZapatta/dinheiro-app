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

class Header extends React.Component<HeaderProps> {
  render() {
    return (
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={this.props.defaultHref} />
          </IonButtons>
          <IonRow>
            <IonCol size-lg="6" offset-lg="3">
              <IonTitle color="primary">{this.props.titulo}</IonTitle>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonHeader>
    );
  }
}

export default Header;
