import React from 'react';
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { trash } from 'ionicons/icons';

interface ButtonAdicionarProps {
  isSubmitting?: boolean;
  action: any;
  slot?: 'bottom' | 'top' | 'center';
  vertical?: 'bottom' | 'top' | 'center';
  horizontal?: 'center' | 'start' | 'end';
  icon?: any;
}

export default function ButtonExcluir(
  props: ButtonAdicionarProps
): JSX.Element {
  const { isSubmitting, action, slot, vertical, horizontal, icon } = props;
  return (
    <IonFab vertical={vertical} horizontal={horizontal} slot={slot}>
      <IonFabButton disabled={isSubmitting} onClick={action} color="tertiary">
        <IonIcon icon={icon || trash} />
      </IonFabButton>
    </IonFab>
  );
}

ButtonExcluir.defaultProps = {
  isSubmitting: false,
  slot: 'fixed',
  horizontal: 'start',
  vertical: 'bottom',
  icon: null,
};
