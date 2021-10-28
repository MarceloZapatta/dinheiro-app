import React from 'react';
import { IonList, IonItem, IonLabel, IonInput } from '@ionic/react';
import './Categorias.scss';
import { useFormikContext } from 'formik';
import CoresInput from '../../components/cores/CoresInput';
import IconesInput from '../../components/icones/IconesInput';
import { CategoriasValues } from './CategoriasAdicionar';
import ErrorField from '../../components/ErrorField';
import { Categoria } from '../../services/DinheiroService';

interface CategoriasFormProps {
  categoria?: Categoria;
}

export default function CategoriasForm(
  props: CategoriasFormProps
): JSX.Element {
  const { values, errors, handleChange, setFieldValue } =
    useFormikContext<CategoriasValues>();

  const { categoria } = props;
  return (
    <IonList>
      <IonItem>
        <IonLabel position="floating">Nome</IonLabel>
        <IonInput name="nome" value={values.nome} onIonChange={handleChange} />
      </IonItem>
      {errors.nome ? (
        <ErrorField
          mensagem={errors.nome}
          testid="organizacao-tipo-id-invaildo-text"
        />
      ) : null}
      <CoresInput
        initialValue={categoria ? categoria.cor : null}
        onChange={(corId: number) => setFieldValue('cor_id', corId)}
      />
      <IconesInput
        initialValue={categoria ? categoria.icone : ''}
        onChange={(icone: string) => setFieldValue('icone', icone)}
      />
    </IonList>
  );
}

CategoriasForm.defaultProps = {
  categoria: null,
};
