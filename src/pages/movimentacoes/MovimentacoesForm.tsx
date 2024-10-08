import React, { useState, useContext } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import './Movimentacoes.scss';
import { useFormikContext } from 'formik';
import moment from 'moment';
import { MovimentacoesValues } from './MovimentacoesAdicionar';
import ErrorField from '../../components/ErrorField';
import { Movimentacao } from '../../services/DinheiroService';
import TextMask from '../../components/TextMask';
import CategoriasInput from '../../components/categorias/CategoriasInput';
import ContasInput from '../../components/contas/ContasInput';
import ClienteSelect from '../../components/clientes/ClienteSelect';
import { AuthContext } from '../../App';

interface MovimentacoesFormProps {
  movimentacao?: Movimentacao;
}

export default function MovimentacoesForm(
  props: MovimentacoesFormProps
): JSX.Element {
  const { values, errors, handleChange, setFieldValue } =
    useFormikContext<MovimentacoesValues>();
  const authContext = useContext(AuthContext);

  const [selectedDate, setSelectedDate] = useState(
    values.data_transacao
      ? moment(values.data_transacao, 'DD/MM/YYYY').toISOString()
      : null
  );

  const { movimentacao } = props;
  return (
    <IonList>
      <IonItem>
        <IonLabel>Tipo</IonLabel>
        <IonSelect
          name="despesa"
          value={String(values.despesa)}
          onIonChange={handleChange}
          cancelText="Cancelar"
          interface="popover"
          disabled={!!movimentacao?.cobranca}
        >
          <IonSelectOption value="1">Despesa</IonSelectOption>
          <IonSelectOption value="0">Receita</IonSelectOption>
          {authContext.organizacaoPessoaJuridica && (
            <IonSelectOption value="2">Cobrança</IonSelectOption>
          )}
        </IonSelect>
      </IonItem>
      {authContext.organizacaoPessoaJuridica && (
        <ClienteSelect
          initialValue={movimentacao?.cliente}
          onChange={(cliente) => setFieldValue('cliente_id', cliente.id)}
          disabled={!!movimentacao?.cobranca}
        />
      )}
      {errors.cliente_id ? (
        <ErrorField
          mensagem={errors.cliente_id}
          testid="organizacao-tipo-id-invaildo-text"
        />
      ) : null}
      <IonItem>
        <IonLabel position="floating">Data</IonLabel>
        <IonDatetime
          name="data_transacao"
          value={selectedDate}
          disabled={!!movimentacao?.cobranca}
          onIonChange={(e) => {
            if (e.detail.value) {
              setSelectedDate(e.detail.value);
              setFieldValue(
                'data_transacao',
                moment(e.detail.value).format('DD/MM/YYYY')
              );
            }
          }}
          displayFormat="DD/MM/YYYY"
          cancelText="Cancelar"
          max="2100"
        />
      </IonItem>
      {errors.data_transacao ? (
        <ErrorField
          mensagem={errors.data_transacao}
          testid="organizacao-tipo-id-invaildo-text"
        />
      ) : null}
      <IonItem>
        <IonLabel position="floating">Descricao</IonLabel>
        <IonInput
          name="descricao"
          value={values.descricao}
          disabled={!!movimentacao?.cobranca}
          onIonChange={handleChange}
        />
      </IonItem>
      {errors.descricao ? (
        <ErrorField
          mensagem={errors.descricao}
          testid="organizacao-tipo-id-invaildo-text"
        />
      ) : null}
      <IonItem>
        <IonLabel position="floating">Observações</IonLabel>
        <IonInput
          name="observacoes"
          value={values.observacoes}
          disabled={!!movimentacao?.cobranca}
          onIonChange={handleChange}
        />
      </IonItem>
      {errors.observacoes ? (
        <ErrorField
          mensagem={errors.observacoes}
          testid="observacoes-invalido-text"
        />
      ) : null}
      <IonItem>
        <IonLabel position="floating">Valor</IonLabel>
        <TextMask
          title="Valor"
          color={errors.valor ? 'danger' : ''}
          name="valor"
          initialValue={values.valor}
          money
          onChange={(e) => setFieldValue('valor', e.detail.value)}
          testid="valor-text-mask"
          disabled={!!movimentacao?.cobranca}
        />
      </IonItem>
      {errors.valor ? (
        <ErrorField
          mensagem={errors.valor}
          testid="observacoes-invalido-text"
        />
      ) : null}
      <CategoriasInput
        initialValue={movimentacao?.categoria ?? null}
        onChange={(e) => setFieldValue('categoria_id', e)}
        disabled={!!movimentacao?.cobranca}
      />
      {errors.categoria_id ? (
        <ErrorField
          mensagem={errors.categoria_id}
          testid="categoria_id-invalido-text"
        />
      ) : null}
      <ContasInput
        initialValue={movimentacao?.conta ?? null}
        onChange={(e) => setFieldValue('conta_id', e)}
        disabled={!!movimentacao?.cobranca}
      />
      {errors.conta_id ? (
        <ErrorField
          mensagem={errors.conta_id}
          testid="conta_id-invalido-text"
        />
      ) : null}
    </IonList>
  );
}

MovimentacoesForm.defaultProps = {
  movimentacao: null,
};
