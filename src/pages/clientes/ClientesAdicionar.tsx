import React from 'react';
import { IonContent, IonPage, IonRow, IonGrid, IonCol } from '@ionic/react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router';
import Header from '../../components/Header';
import ClientesForm from './ClientesForm';
import DinheiroService from '../../services/DinheiroService';
import ButtonAdicionar from '../../components/button-adicionar/ButtonAdicionar';

export interface ClientesValues {
  nome?: string;
  email?: string;
  documento?: string;
  endereco: {
    rua?: string;
    numero?: string;
    complemento?: string;
    cidade?: string;
    // eslint-disable-next-line camelcase
    uf_id?: number;
    cep?: string;
  };
}

export interface ClientesErrosValues {
  nome?: string;
  email?: string;
  documento?: string;
  endereco?: {
    rua?: string;
    numero?: string;
    complemento?: string;
    cidade?: string;
    // eslint-disable-next-line camelcase
    uf_id?: number;
    cep?: string;
  };
}

export default function ClientesAdicionar(): JSX.Element {
  const history = useHistory();

  function handleSubmit(
    values: ClientesValues,
    { setSubmitting, setErrors }: any
  ) {
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .storeCliente(values)
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
          history.push('/clientes');
        }

        setSubmitting(false);
      })
      .catch((error) => {
        setSubmitting(false);

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
      });
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Clientes" defaultHref="/clientes" />
      <Formik
        initialValues={{ endereco: {} }}
        onSubmit={(values, functions) => handleSubmit(values, functions)}
        validationSchema={Yup.object().shape({
          nome: Yup.string().required('O nome é obrigatório'),
          email: Yup.string()
            .email('O e-mail é inválido.')
            .required('O e-mail é obrigatório.'),
          documento: Yup.string().required('O documento é obrigatório.'),
          endereco: Yup.object().shape({
            rua: Yup.string().required('A rua é obrigatória.'),
            numero: Yup.string().required('O número é obrigatório.'),
            complemento: Yup.string(),
            cidade: Yup.string().required('A cidade é obrigatória'),
            // eslint-disable-next-line camelcase
            uf_id: Yup.number().required('O estado é obrigatório.'),
            cep: Yup.string()
              .matches(/^\d{5}-\d{3}$/, 'O CEP é inválido.')
              .required('O CEP é obrigatório'),
          }),
        })}
      >
        {({ isSubmitting, submitForm }) => (
          <IonContent>
            <IonGrid>
              <Form>
                <IonRow class="ion-margin-top">
                  <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
                    <ClientesForm />
                  </IonCol>
                </IonRow>
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
