import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router';
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  IonList,
  IonItemDivider,
  IonItem,
  IonLabel,
  IonButton,
  useIonAlert,
  IonSpinner,
} from '@ionic/react';

import { Formik, Form } from 'formik';
import Header from '../../../components/Header';
import MovimentacoesForm from '../MovimentacoesForm';

import DinheiroService, {
  Movimentacao,
} from '../../../services/DinheiroService';

export default function ImportacoesEditar(): JSX.Element {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const formRef = useRef<any>();
  const [present] = useIonAlert();
  const params = useParams<{ id?: string }>();
  useEffect(() => {
    fetchMovimentacaoImportacoes();
  }, []);
  const history = useHistory();

  async function fetchMovimentacaoImportacoes() {
    const dinheiro = new DinheiroService();
    dinheiro
      .getMovimentacaoImportacao(Number(params.id))
      .then(
        (response) =>
          response.data?.movimentacoes &&
          setMovimentacoes(response.data?.movimentacoes)
      )
      .catch(() => history.push('/movimentacoes/importacoes'));
  }

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
        }

        setMovimentacoes((movimentacoesOld) => {
          const newMovimentacoes = movimentacoesOld.filter(
            (movimentacaoOld) =>
              Number(movimentacaoOld.id) !== Number(values.id)
          );
          if (newMovimentacoes.length <= 0) {
            history.push('/movimentacoes');
          }

          return newMovimentacoes;
        });

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

  function handleExcluir(movimentacao: Movimentacao) {
    return present({
      header: 'Atenção',
      message: !movimentacao?.cobranca
        ? 'Essa ação não poderá ser revertida, deseja realmente excluir?'
        : 'Essa ação não poderá ser revertida, deseja realmente cancelar a cobrança?',
      buttons: [
        'Cancelar',
        {
          text: 'Ok',
          handler: () => {
            const dinheiroService = new DinheiroService();

            return dinheiroService
              .deleteMovimentacao(Number(movimentacao.id))
              .then((response) => {
                setMovimentacoes((movimentacoesOld) => {
                  const newMovimentacoes = movimentacoesOld.filter(
                    (movimentacaoOld) =>
                      Number(movimentacaoOld.id) !== Number(movimentacao.id)
                  );
                  if (newMovimentacoes.length <= 0) {
                    history.push('/movimentacoes');
                  }

                  return newMovimentacoes;
                });
              });
          },
        },
      ],
    });
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Importações" disableBackButton />
      <IonContent>
        <IonGrid>
          <IonRow class="ion-margin-top">
            <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
              <IonList>
                <IonItem>
                  <IonLabel>Movimentações pendentes de confirmação:</IonLabel>
                </IonItem>
                <IonItemDivider />
                {movimentacoes.map((movimentacao, key) => (
                  <>
                    <Formik
                      key={movimentacao.id}
                      initialValues={{
                        ...movimentacao,
                      }}
                      onSubmit={(values, functions) =>
                        handleSubmit(values, functions)
                      }
                      innerRef={formRef}
                    >
                      {({ submitForm, isSubmitting }) => (
                        <Form>
                          <MovimentacoesForm movimentacao={movimentacao} />
                          <IonItem>
                            <IonCol>
                              <IonButton
                                fill="clear"
                                color="danger"
                                onClick={() => handleExcluir(movimentacao)}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <IonSpinner color="primary" />
                                ) : (
                                  'Cancelar'
                                )}
                              </IonButton>
                            </IonCol>
                            <IonCol className="ion-text-right">
                              <IonButton
                                fill="clear"
                                onClick={() => submitForm()}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <IonSpinner color="primary" />
                                ) : (
                                  'Confirmar'
                                )}
                              </IonButton>
                            </IonCol>
                          </IonItem>
                        </Form>
                      )}
                    </Formik>
                    {key !== movimentacoes.length - 1 && <IonItemDivider />}
                  </>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
