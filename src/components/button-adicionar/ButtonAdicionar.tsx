import React from 'react';
import { IonFab, IonFabButton, IonIcon, IonSpinner } from '@ionic/react';
import { checkmark } from 'ionicons/icons';

interface ButtonAdicionarProps {
  isSubmitting?: boolean;
  action: any;
  slot?: 'bottom' | 'top' | 'center';
  vertical?: 'bottom' | 'top' | 'center';
  horizontal?: 'center' | 'start' | 'end';
  icon?: any;
}

export default function ButtonAdicionar(
  props: ButtonAdicionarProps
): JSX.Element {
  const { isSubmitting, action, slot, vertical, horizontal, icon } = props;
  return (
    <IonFab vertical={vertical} horizontal={horizontal} slot={slot}>
      <IonFabButton disabled={isSubmitting} onClick={action}>
        {isSubmitting ? <IonSpinner /> : <IonIcon icon={icon || checkmark} />}
      </IonFabButton>
    </IonFab>
  );
}

ButtonAdicionar.defaultProps = {
  isSubmitting: false,
  slot: 'fixed',
  horizontal: 'end',
  vertical: 'bottom',
  icon: null,
};
