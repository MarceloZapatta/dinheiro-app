import React, { useEffect, useState } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonItemDivider,
  // IonCol,
  IonCheckbox,
  IonItemGroup,
  IonRow,
  IonCol,
} from '@ionic/react';
import './Clientes.scss';
import { useFormikContext } from 'formik';
import { ClientesValues } from './ClientesAdicionar';
import ErrorField from '../../components/ErrorField';
import TextMask from '../../components/TextMask';
import DinheiroService, { Uf } from '../../services/DinheiroService';
import ViaCepService from '../../services/ViaCepService';

export default function ClientesForm(): JSX.Element {
  const { values, errors, handleChange, setFieldValue } =
    useFormikContext<ClientesValues>();
  const [ufs, setUfs] = useState<Uf[]>([]);

  useEffect(() => {
    const dinheiroService = new DinheiroService();
    dinheiroService.getUfs().then((response) => setUfs(response.data));
  }, []);

  const handleChangeCep = (e: any) => {
    handleChange(e);
    const viaCepService = new ViaCepService();
    viaCepService
      .pesquisaCep(Number(e.detail.value.replace(/\D/g, '')))
      .then((response) => response?.data)
      .then((response) => {
        if (response) {
          setFieldValue('endereco.rua', response.logradouro);
          setFieldValue('endereco.complemento', response.complemento);
          setFieldValue('endereco.cidade', response.localidade);
          setFieldValue(
            'endereco.uf_id',
            ufs.find((uf) => uf.nome === response.uf)?.id
          );
        }
      })
      .catch(() => null);
  };

  return (
    <IonList>
      <IonItemGroup>
        <IonItemDivider>
          <IonLabel>Dados pessoais</IonLabel>
        </IonItemDivider>
        <IonItem>
          <IonLabel position="floating">Nome</IonLabel>
          <IonInput
            name="nome"
            value={values.nome}
            onIonChange={handleChange}
          />
        </IonItem>
        {errors.nome ? (
          <ErrorField mensagem={errors.nome} testid="nome-invalido-text" />
        ) : null}
        <IonItem>
          <IonLabel position="floating">E-mail</IonLabel>
          <IonInput
            name="email"
            value={values.email}
            onIonChange={handleChange}
          />
        </IonItem>
        {errors.email ? (
          <ErrorField mensagem={errors.email} testid="email-invalido-text" />
        ) : null}
        <IonItem>
          <IonLabel position="floating">Documento</IonLabel>
          <TextMask
            name="documento"
            title="documento"
            color={errors.documento ? 'danger' : ''}
            testid="endereco.documento-input"
            initialValue={String(values.documento)}
            mask={['999.999.999-99', '99.999.999/9999-99']}
            onChange={(e) => handleChangeCep(e)}
          />
        </IonItem>
        {errors.documento ? (
          <ErrorField
            mensagem={errors.documento}
            testid="documento-invalido-text"
          />
        ) : null}
      </IonItemGroup>
      <IonItemGroup>
        <IonItemDivider>
          <IonLabel>Endereço</IonLabel>
        </IonItemDivider>
        <IonItem>
          <IonLabel position="floating">CEP</IonLabel>
          <TextMask
            name="endereco.cep"
            title="cep"
            color={errors.endereco?.cep ? 'danger' : ''}
            testid="endereco.cep-input"
            initialValue={String(values.endereco.cep)}
            mask="99999-999"
            onChange={(e) => handleChangeCep(e)}
          />
        </IonItem>
        {errors.endereco?.cep ? (
          <ErrorField
            mensagem={errors.endereco?.cep}
            testid="cep-invalido-text"
          />
        ) : null}
        <IonItem>
          <IonLabel position="floating">Rua</IonLabel>
          <IonInput
            name="endereco.rua"
            value={values.endereco.rua}
            onIonChange={handleChange}
          />
        </IonItem>
        {errors.endereco?.rua ? (
          <ErrorField
            mensagem={errors.endereco?.rua}
            testid="rua-invalido-text"
          />
        ) : null}
        <IonItemGroup>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Número</IonLabel>
                <IonInput
                  name="endereco.numero"
                  value={values.endereco.numero}
                  onIonChange={handleChange}
                  disabled={values.endereco.numero === 'N/A'}
                />
              </IonItem>
            </IonCol>
            <IonCol size="3">
              <IonItem>
                <IonLabel position="stacked">Sem número</IonLabel>
                <IonCheckbox
                  checked={values.endereco.numero === 'N/A'}
                  onIonChange={(e) =>
                    setFieldValue(
                      'endereco.numero',
                      values.endereco.numero === 'N/A' ? '' : 'N/A'
                    )
                  }
                />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonItemGroup>
        {errors.endereco?.numero ? (
          <ErrorField
            mensagem={errors.endereco?.numero}
            testid="numero-invalido-text"
          />
        ) : null}
        <IonItem>
          <IonLabel position="floating">Complemento</IonLabel>
          <IonInput
            name="endereco.complemento"
            value={values.endereco.complemento}
            onIonChange={handleChange}
          />
        </IonItem>
        {errors.endereco?.complemento ? (
          <ErrorField
            mensagem={errors.endereco?.complemento}
            testid="complemento-invalido-text"
          />
        ) : null}
        <IonItem>
          <IonLabel position="floating">Cidade</IonLabel>
          <IonInput
            name="endereco.cidade"
            value={values.endereco?.cidade}
            onIonChange={handleChange}
          />
        </IonItem>
        {errors.endereco?.cidade ? (
          <ErrorField
            mensagem={errors.endereco?.cidade}
            testid="cidade-invalido-text"
          />
        ) : null}
        <IonItem>
          <IonLabel position="floating">Estado</IonLabel>
          <IonSelect
            name="endereco.uf_id"
            value={values.endereco.uf_id}
            onIonChange={handleChange}
            cancelText="Cancelar"
          >
            {ufs.map((uf) => (
              <IonSelectOption key={uf.id} value={uf.id}>
                {uf.sigla}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        {errors.endereco?.uf_id ? (
          <ErrorField
            mensagem={errors.endereco?.uf_id}
            testid="uf_id-invalido-text"
          />
        ) : null}
      </IonItemGroup>
    </IonList>
  );
}

ClientesForm.defaultProps = {
  movimentacao: null,
};
