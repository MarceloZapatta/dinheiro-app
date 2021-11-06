import React from 'react';
import { IonContent, IonPage, IonRow, IonGrid, IonCol } from '@ionic/react';

import { Form, Formik } from 'formik';
import { useHistory } from 'react-router';
import Header from '../../components/Header';
import ContasForm from './ContasForm';
import DinheiroService from '../../services/DinheiroService';
import ButtonAdicionar from '../../components/button-adicionar/ButtonAdicionar';

export interface ContasValues {
  nome: string;
  // eslint-disable-next-line camelcase
  cor_id: number;
  icone: string;
  // eslint-disable-next-line camelcase
  saldo_inicial: number;
}

export interface ContasErrosValues {
  nome?: string;
  // eslint-disable-next-line camelcase
  cor_id?: string;
  icone?: string;
  // eslint-disable-next-line camelcase
  saldo_inicial?: string;
}

export default function ContasAdicionar(): JSX.Element {
  const history = useHistory();

  function handleSubmit(
    values: ContasValues,
    { setSubmitting, setErrors }: any
  ) {
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .storeConta(values)
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
          history.push('/contas');
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

  function handleValidate(values: ContasValues) {
    const errors: ContasErrosValues = {};

    if (!values.nome) {
      errors.nome = 'O nome é obrigatório';
    }

    if (!values.cor_id) {
      errors.cor_id = 'A cor é obrigatória';
    }

    if (!values.icone) {
      errors.icone = 'O ícone é obrigatório';
    }

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(values.saldo_inicial)) {
      errors.saldo_inicial = 'O saldo inicial é inválido';
    }

    return errors;
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Contas" defaultHref="/contas" />
      <IonContent>
        <IonGrid>
          <Formik
            initialValues={{
              nome: '',
              cor_id: 0,
              icone: '',
              saldo_inicial: 0,
            }}
            onSubmit={(values, functions) => handleSubmit(values, functions)}
            validate={(values) => handleValidate(values)}
          >
            {({ isSubmitting, submitForm }) => (
              <Form>
                <IonRow class="ion-margin-top">
                  <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
                    <ContasForm />
                  </IonCol>
                </IonRow>
                <ButtonAdicionar
                  action={() => submitForm()}
                  isSubmitting={isSubmitting}
                />
              </Form>
            )}
          </Formik>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
