import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonRow,
  IonGrid,
  IonCol,
  useIonAlert,
} from '@ionic/react';

import { Form, Formik } from 'formik';
import { useHistory, useParams } from 'react-router';
import * as Yup from 'yup';
import Header from '../../components/Header';
import MovimentacoesForm from './MovimentacoesForm';
import DinheiroService, { Movimentacao } from '../../services/DinheiroService';
import ButtonExcluir from '../../components/button-excluir/ButtonExcluir';
import ButtonAdicionar from '../../components/button-adicionar/ButtonAdicionar';

export interface MovimentacoesValues {
  id?: number;
  nome: string;
  // eslint-disable-next-line camelcase
  cor_id: number;
  icone: string;
  // eslint-disable-next-line camelcase
  saldo_inicial: number;
}

export interface MovimentacoesErrosValues {
  nome?: string;
  // eslint-disable-next-line camelcase
  cor_id?: string;
  icone?: string;
  // eslint-disable-next-line camelcase
  saldo_inicial?: string;
}

export default function MovimentacoesEditar(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [present] = useIonAlert();
  const [movimentacao, setMovimentacao] = useState<Movimentacao>();
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovimentacao();
  }, []);

  function handleSubmit(values: any, { setSubmitting, setErrors }: any) {
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .updateMovimentacao(values)
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

  function fetchMovimentacao() {
    setLoading(true);
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .getMovimentacao(Number(id))
      .then((response) => {
        if (response.data) {
          setMovimentacao(response.data);
        }
        return setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        throw e;
      });
  }

  function handleExcluir() {
    return present({
      header: 'Atenção',
      message: 'Essa ação não poderá ser revertida, deseja realmente excluir?',
      buttons: [
        'Cancelar',
        {
          text: 'Ok',
          handler: () => {
            const dinheiroService = new DinheiroService();
            return dinheiroService
              .deleteMovimentacao(Number(id))
              .then((response) => {
                history.push('/movimentacoes');
              });
          },
        },
      ],
    });
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Movimentacoes" defaultHref="/movimentacoes" />
      <IonContent>
        <IonGrid>
          {!loading && movimentacao && (
            <Formik
              initialValues={movimentacao}
              onSubmit={(values, functions) => handleSubmit(values, functions)}
              validationSchema={Yup.object().shape({
                descricao: Yup.string().required('A descrição é obrigatória.'),
                observacoes: Yup.string(),
                valor: Yup.number().required(
                  'O valor da movimentação é obrigatório.'
                ),
                data_transacao: Yup.string().required(
                  'A data da transação é obrigatória.'
                ),
                conta_id: Yup.number().required('A conta é obrigatória.'),
                categoria_id: Yup.number().required(
                  'A categoria é obrigatória.'
                ),
              })}
            >
              {({ isSubmitting, submitForm }) => (
                <Form>
                  <IonRow class="ion-margin-top">
                    <IonCol size-lg="4" offset-lg="4" size-md="8" offset-md="2">
                      <MovimentacoesForm movimentacao={movimentacao} />
                    </IonCol>
                  </IonRow>
                  <ButtonAdicionar
                    isSubmitting={isSubmitting}
                    action={() => submitForm()}
                  />
                  <ButtonExcluir action={() => handleExcluir()} />
                </Form>
              )}
            </Formik>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
