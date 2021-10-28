import React from 'react';
import { IonList, IonItem, IonLabel, IonInput } from '@ionic/react';
import './Contas.scss';
import { useFormikContext } from 'formik';
import CoresInput from '../../components/cores/CoresInput';
import IconesInput from '../../components/icones/IconesInput';
import TextMask from '../../components/TextMask';
import { ContasValues } from './ContasAdicionar';
import ErrorField from '../../components/ErrorField';
import { Conta } from '../../services/DinheiroService';

interface ContasFormProps {
  conta?: Conta;
}

export default function ContasForm(props: ContasFormProps): JSX.Element {
  const { values, errors, handleChange, setFieldValue } =
    useFormikContext<ContasValues>();

  const { conta } = props;
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
        initialValue={conta ? conta.cor : null}
        onChange={(corId: number) => setFieldValue('cor_id', corId)}
      />
      <IconesInput
        initialValue={conta ? conta.icone : ''}
        onChange={(icone: string) => setFieldValue('icone', icone)}
      />
      <IonItem>
        <IonLabel position="floating">Saldo inicial</IonLabel>
        <TextMask
          name="saldo_inicial"
          title="Nome"
          testid="saldo-inicial-input"
          initialValue={Number(conta?.saldo_inicial)}
          money
          color="teste"
          onChange={(e) => setFieldValue('saldo_inicial', e.detail.value)}
          disabled={!!conta}
        />
      </IonItem>
      {errors.saldo_inicial ? (
        <ErrorField
          mensagem={errors.saldo_inicial}
          testid="organizacao-tipo-id-invaildo-text"
        />
      ) : null}
    </IonList>
  );
}

ContasForm.defaultProps = {
  conta: null,
};
