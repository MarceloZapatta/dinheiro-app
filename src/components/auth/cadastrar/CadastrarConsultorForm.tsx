import { IonItem, IonItemDivider, IonTextarea } from '@ionic/react';
import React from 'react';
import { useFormikContext } from 'formik';
import ErrorField from '../../ErrorField';

interface CadastrarConsultorFormValues {
  consultorResumo?: string;
}

export default function CadastrarConsultorForm(): JSX.Element {
  const { errors, handleChange } =
    useFormikContext<CadastrarConsultorFormValues>();

  return (
    <>
      <IonItemDivider>Resumo consultor</IonItemDivider>
      <IonItem>
        <IonTextarea
          name="consultorResumo"
          placeholder="Descreva seu resumo como consultor financeiro, essa informação ficará pública aos usuários"
          onIonChange={handleChange}
        />
      </IonItem>
      {errors.consultorResumo ? (
        <ErrorField
          mensagem={errors.consultorResumo}
          testid="consultorResumo-invalido-text"
        />
      ) : null}
    </>
  );
}
