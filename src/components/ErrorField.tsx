import { IonItem, IonText } from '@ionic/react';
import React from 'react';

interface ErrorFieldProps {
  testid: string;
  mensagem: string;
}

export default function ErrorField(props: ErrorFieldProps): JSX.Element {
  const { testid, mensagem } = props;
  return (
    <IonItem>
      <IonText color="danger" data-testid={testid}>
        <small>{mensagem}</small>
      </IonText>
    </IonItem>
  );
}
