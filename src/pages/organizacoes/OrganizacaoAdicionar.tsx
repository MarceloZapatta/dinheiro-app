import {
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonRow,
} from '@ionic/react';
import { Form, Formik } from 'formik';

import React from 'react';
import { useHistory } from 'react-router';
import * as Yup from 'yup';
import ButtonAdicionar from '../../components/button-adicionar/ButtonAdicionar';
import ErrorField from '../../components/ErrorField';
import Header from '../../components/Header';
import DinheiroService from '../../services/DinheiroService';
import OrganizacaoPerfilForm from './OrganizacaoPerfilForm';

export interface OrganizacaoAdicionarValues {
  // eslint-disable-next-line camelcase
  organizacao_tipo_id?: number | string | null;
  documento?: string | null;
  nome?: string | null;
  email?: string | null;
  // eslint-disable-next-line camelcase
  razao_social?: string | null;
  // eslint-disable-next-line camelcase
  uf_id?: string | null;
  cep?: string | null;
  cidade?: string | null;
  complemento?: string | null;
  numero?: string | null;
  rua?: string | null;
  telefone?: string | null;
  // eslint-disable-next-line camelcase
  convite_novos?: string[];
}

export default function OrganizacaoAdicionar(): JSX.Element {
  const history = useHistory();

  function handleSubmit(
    values: OrganizacaoAdicionarValues,
    { setSubmitting, setErrors }: any
  ) {
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .storeOrganizacao(values)
      .then((response) => {
        if (response.sucesso !== true) {
          if (response.mensagem === 'Network request failed') {
            response.mensagem = 'Erro de conexão. Tente novamente mais tarde.';
          }

          if (response.status_codigo === 422 && response.erros) {
            if (Object.keys(response.erros).length > 0) {
              setErrors(dinheiroService.transformDinheiroErros(response.erros));
            }
          }
        } else {
          history.push('/selecionar-organizacao');
        }

        setSubmitting(false);
      })
      .catch((error) => {
        if (
          error.response.data &&
          error.response.data.status_codigo === 422 &&
          error.response.data.erros
        ) {
          if (Object.keys(error.response.data.erros).length > 0) {
            const erros = dinheiroService.transformDinheiroErros(
              error.response.data.erros
            );

            setErrors(erros);
          }
        }
        setSubmitting(false);
      });
  }

  return (
    <IonPage data-testid="organizacao-adicionar-page">
      <Header titulo="Adicionar organização" disableBackButton />
      <Formik
        initialValues={{
          organizacao_tipo_id: null,
          nome: null,
          email: null,
          razao_social: null,
          documento: null,
          uf_id: null,
          cep: null,
          cidade: null,
          complemento: null,
          numero: null,
          rua: null,
          telefone: null,
          convite_novos: [],
          organizacao_nova: true,
        }}
        onSubmit={(values, functions) => handleSubmit(values, functions)}
        validationSchema={Yup.object().shape({
          convite_novos: Yup.array().of(
            Yup.string()
              .email('O e-mail é inválido.')
              .required('O e-mail é obrigatório')
          ),
        })}
      >
        {({ values, errors, handleChange, submitForm, isSubmitting }) => (
          <IonContent>
            <IonGrid>
              <Form>
                <IonRow class="ion-margin-top">
                  <IonCol size-lg="4" offset-lg="4" size-md="8" offset-md="2">
                    <IonList>
                      <IonRadioGroup
                        name="organizacao_tipo_id"
                        onIonChange={handleChange}
                      >
                        <IonListHeader>
                          <IonLabel>Tipo de pessoa</IonLabel>
                        </IonListHeader>
                        <IonItem>
                          <IonLabel>Pessoa Física</IonLabel>
                          <IonRadio slot="start" value={1} />
                        </IonItem>
                        <IonItem>
                          <IonLabel>Pessoa Júridica</IonLabel>
                          <IonRadio slot="start" value={2} />
                        </IonItem>
                      </IonRadioGroup>
                    </IonList>
                    {errors.organizacao_tipo_id ? (
                      <ErrorField
                        mensagem={errors.organizacao_tipo_id}
                        testid="organizacao-tipo-id-invaildo-text"
                      />
                    ) : null}
                  </IonCol>
                </IonRow>
                {values.organizacao_tipo_id && (
                  <>
                    <IonRow>
                      <IonCol
                        size-lg="4"
                        offset-lg="4"
                        size-md="8"
                        offset-md="2"
                      >
                        <OrganizacaoPerfilForm />
                      </IonCol>
                    </IonRow>
                  </>
                )}
              </Form>
            </IonGrid>
            <ButtonAdicionar
              action={() => submitForm()}
              isSubmitting={isSubmitting}
            />
          </IonContent>
        )}
      </Formik>
    </IonPage>
  );
}
