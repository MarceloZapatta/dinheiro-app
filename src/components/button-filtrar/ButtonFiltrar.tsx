import React from 'react';
import { IonFab, IonFabButton, IonIcon, IonSpinner } from '@ionic/react';
import { funnelOutline } from 'ionicons/icons';

interface ButtonFiltrarProps {
  isSubmitting?: boolean;
  action: any;
  slot?: 'bottom' | 'top' | 'center';
  vertical?: 'bottom' | 'top' | 'center';
  horizontal?: 'center' | 'start' | 'end';
  icon?: any;
}

export default function ButtonFiltrar(props: ButtonFiltrarProps): JSX.Element {
  const { isSubmitting, action, slot, vertical, horizontal, icon } = props;
  return (
    <IonFab vertical={vertical} horizontal={horizontal} slot={slot}>
      <IonFabButton disabled={isSubmitting} onClick={action} color="tertiary">
        {isSubmitting ? (
          <IonSpinner />
        ) : (
          <IonIcon icon={icon || funnelOutline} />
        )}
      </IonFabButton>
    </IonFab>
  );
}

ButtonFiltrar.defaultProps = {
  isSubmitting: false,
  slot: 'fixed',
  horizontal: 'start',
  vertical: 'bottom',
  icon: null,
};
