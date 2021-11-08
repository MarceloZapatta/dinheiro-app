import React from 'react';
import { IonContent, IonPage, IonRow, IonGrid, IonCol } from '@ionic/react';
import moment from 'moment';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router';
import Header from '../../components/Header';
import MovimentacoesForm from './MovimentacoesForm';
import DinheiroService from '../../services/DinheiroService';
import ButtonAdicionar from '../../components/button-adicionar/ButtonAdicionar';

export interface MovimentacoesValues {
  despesa: number;
  descricao: string;
  observacoes: string;
  valor: number;
  // eslint-disable-next-line camelcase
  data_transacao: string;
  // eslint-disable-next-line camelcase
  conta_id: number;
  // eslint-disable-next-line camelcase
  categoria_id: number;
}

export interface MovimentacoesErrosValues {
  descricao?: string;
  observacoes?: string;
  valor?: number;
  // eslint-disable-next-line camelcase
  data_transacao?: string;
  // eslint-disable-next-line camelcase
  conta_id?: number;
  // eslint-disable-next-line camelcase
  categoria_id?: number;
}

export default function MovimentacoesAdicionar(): JSX.Element {
  const history = useHistory();

  function handleSubmit(
    values: MovimentacoesValues,
    { setSubmitting, setErrors }: any
  ) {
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .storeMovimentacao(values)
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
          history.push('/movimentacoes');
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
      <Header titulo="Movimentacoes" defaultHref="/movimentacoes" />
      <IonContent>
        <IonGrid>
          <Formik
            initialValues={{
              despesa: 1,
              descricao: '',
              observacoes: '',
              valor: 0,
              data_transacao: moment().format('DD/MM/YYYY'),
              conta_id: 0,
              categoria_id: 0,
            }}
            onSubmit={(values, functions) => handleSubmit(values, functions)}
            validationSchema={Yup.object().shape({
              despesa: Yup.number()
                .min(0)
                .max(1)
                .required('O tipo de transação é obrigatório'),
              descricao: Yup.string().required('A descrição é obrigatória.'),
              observacoes: Yup.string(),
              valor: Yup.number().required(
                'O valor da movimentação é obrigatório.'
              ),
              data_transacao: Yup.string().required(
                'A data da transação é obrigatória.'
              ),
              conta_id: Yup.number().required('A conta é obrigatória.'),
              categoria_id: Yup.number().required('A categoria é obrigatória.'),
            })}
          >
            {({ isSubmitting, submitForm }) => (
              <Form>
                <IonRow class="ion-margin-top">
                  <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
                    <MovimentacoesForm />
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
