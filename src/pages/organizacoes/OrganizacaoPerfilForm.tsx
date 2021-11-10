import React, { useState, useEffect } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonItemDivider,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useFormikContext } from 'formik';
import ErrorField from '../../components/ErrorField';
import DinheiroService, {
  Organizacao,
  Uf,
} from '../../services/DinheiroService';
import OrganizacaoPerfilPessoas from './OrganizacacaoPerfilPessoas';
import TextMask from '../../components/TextMask';
import ViaCepService from '../../services/ViaCepService';

interface OrganizacaoPerfilFormProps {
  organizacao?: Organizacao;
}

interface OrganizacaoPerfilValues {
  nome?: string;
  hash?: string;
  // eslint-disable-next-line camelcase
  organizacao_tipo_id?: number;
  // eslint-disable-next-line camelcase
  razao_social?: string;
  documento?: number;
  email?: string;
  telefone?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  cidade?: string;
  // eslint-disable-next-line camelcase
  uf_id?: number;
  cep?: number;
  // eslint-disable-next-line camelcase
  organizacao_nova: boolean;
}

export default function OrganizacaoPerfilForm(
  props: OrganizacaoPerfilFormProps
): JSX.Element {
  const { values, errors, handleChange, setFieldValue } =
    useFormikContext<OrganizacaoPerfilValues>();
  const { organizacao } = props;
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
          setFieldValue('rua', response.logradouro);
          setFieldValue('complemento', response.complemento);
          setFieldValue('cidade', response.localidade);
          setFieldValue('uf_id', ufs.find((uf) => uf.nome === response.uf)?.id);
        }
      })
      .catch(() => null);
  };

  const organizacaoTipoIdPessoaJuridica = 2;

  return (
    <>
      <IonList>
        {values.organizacao_tipo_id === organizacaoTipoIdPessoaJuridica && (
          <>
            <IonItem>
              <IonLabel position="floating">CNPJ</IonLabel>
              <TextMask
                name="documento"
                title="Documento"
                color={errors.documento ? 'danger' : ''}
                testid="cnpj-input"
                initialValue={String(values.documento)}
                mask="99.999.999/9999-99"
                onChange={handleChange}
              />
            </IonItem>
            {errors.documento ? (
              <ErrorField
                mensagem={errors.documento}
                testid="documento-invaildo-text"
              />
            ) : null}
          </>
        )}
        <IonItem>
          <IonLabel position="floating">Nome</IonLabel>
          <IonInput
            name="nome"
            value={values.nome}
            onIonChange={handleChange}
          />
        </IonItem>
        {errors.nome ? (
          <ErrorField
            mensagem={errors.nome}
            testid="organizacao-tipo-id-invaildo-text"
          />
        ) : null}
        {values.organizacao_tipo_id === organizacaoTipoIdPessoaJuridica &&
          !values.organizacao_nova && (
            <>
              <IonItem>
                <IonLabel position="floating">Razão social</IonLabel>
                <IonInput
                  name="razao_social"
                  value={values.razao_social}
                  onIonChange={handleChange}
                />
              </IonItem>
              {errors.razao_social ? (
                <ErrorField
                  mensagem={errors.razao_social}
                  testid="razao_social-invalido-text"
                />
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
                <ErrorField
                  mensagem={errors.email}
                  testid="email-invalido-text"
                />
              ) : null}
              <IonItem>
                <IonLabel position="floating">Telefone</IonLabel>
                <TextMask
                  name="telefone"
                  title="Documento"
                  color={errors.telefone ? 'danger' : ''}
                  testid="cnpj-input"
                  initialValue={String(values.telefone)}
                  mask={['(99) 9999-9999', '(99) 99999-9999']}
                  onChange={handleChange}
                />
              </IonItem>
              {errors.telefone ? (
                <ErrorField
                  mensagem={errors.telefone}
                  testid="telefone-invalido-text"
                />
              ) : null}
              <IonItemDivider>
                <IonLabel>Endereço</IonLabel>
              </IonItemDivider>
              <IonItem>
                <IonLabel position="floating">CEP</IonLabel>
                <TextMask
                  name="cep"
                  title="cep"
                  color={errors.cep ? 'danger' : ''}
                  testid="cep-input"
                  initialValue={String(values.cep)}
                  mask="99999-999"
                  onChange={(e) => handleChangeCep(e)}
                />
              </IonItem>
              {errors.cep ? (
                <ErrorField mensagem={errors.cep} testid="cep-invalido-text" />
              ) : null}
              <IonItem>
                <IonLabel position="floating">Rua</IonLabel>
                <IonInput
                  name="rua"
                  value={values.rua}
                  onIonChange={handleChange}
                />
              </IonItem>
              {errors.rua ? (
                <ErrorField mensagem={errors.rua} testid="rua-invalido-text" />
              ) : null}
              <IonItem>
                <IonLabel position="floating">Número</IonLabel>
                <IonInput
                  name="numero"
                  value={values.numero}
                  onIonChange={handleChange}
                />
              </IonItem>
              {errors.numero ? (
                <ErrorField
                  mensagem={errors.numero}
                  testid="numero-invalido-text"
                />
              ) : null}
              <IonItem>
                <IonLabel position="floating">Complemento</IonLabel>
                <IonInput
                  name="complemento"
                  value={values.complemento}
                  onIonChange={handleChange}
                />
              </IonItem>
              {errors.complemento ? (
                <ErrorField
                  mensagem={errors.complemento}
                  testid="complemento-invalido-text"
                />
              ) : null}
              <IonItem>
                <IonLabel position="floating">Cidade</IonLabel>
                <IonInput
                  name="cidade"
                  value={values.cidade}
                  onIonChange={handleChange}
                />
              </IonItem>
              {errors.cidade ? (
                <ErrorField
                  mensagem={errors.cidade}
                  testid="cidade-invalido-text"
                />
              ) : null}
              <IonItem>
                <IonLabel position="floating">Estado</IonLabel>
                <IonSelect
                  name="uf_id"
                  value={values.uf_id}
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
              {errors.uf_id ? (
                <ErrorField
                  mensagem={errors.uf_id}
                  testid="uf_id-invalido-text"
                />
              ) : null}
            </>
          )}
      </IonList>
      <OrganizacaoPerfilPessoas
        pessoas={organizacao?.pessoas || []}
        convites={organizacao?.convites || []}
      />
    </>
  );
}

OrganizacaoPerfilForm.defaultProps = {
  organizacao: null,
};
