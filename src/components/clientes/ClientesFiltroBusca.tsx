import React from 'react';

import { IonItem, IonLabel, IonInput, IonIcon } from '@ionic/react';
import { useFormikContext } from 'formik';
import { search } from 'ionicons/icons';
import { ClientesFiltros } from '../../pages/clientes/Clientes';

export default function ClientesFiltroBusca(): JSX.Element {
  const { values, handleChange, submitForm } =
    useFormikContext<ClientesFiltros>();

  return (
    <IonItem>
      <IonLabel position="stacked">
        Buscar por nome, e-mail ou documento
      </IonLabel>
      <IonIcon icon={search} slot="start" size="small" color="primary" />
      <IonInput
        name="busca"
        value={values.busca}
        onIonChange={(e) => {
          handleChange(e);
          submitForm();
        }}
      />
    </IonItem>
  );
}
