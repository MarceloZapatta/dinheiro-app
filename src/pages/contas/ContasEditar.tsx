import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonRow,
  IonGrid,
  IonCol,
  IonFab,
  IonFabButton,
  IonIcon,
  useIonAlert,
} from '@ionic/react';

import { Form, Formik } from 'formik';
import { useHistory, useParams } from 'react-router';
import { checkmark } from 'ionicons/icons';
import Header from '../../components/Header';
import ContasForm from './ContasForm';
import DinheiroService, { Conta } from '../../services/DinheiroService';
import ButtonExcluir from '../../components/button-excluir/ButtonExcluir';

export interface ContasValues {
  id?: number;
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

export default function ContasEditar(): JSX.Element {
  const { id } = useParams();
  const [present] = useIonAlert();
  const [conta, setConta] = useState<Conta>();
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConta();
  }, []);

  function handleSubmit(
    values: ContasValues,
    { setSubmitting, setErrors }: any
  ) {
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .updateConta(values)
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

  function fetchConta() {
    setLoading(true);
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .getConta(id)
      .then((response) => {
        if (response.data) {
          setConta(response.data);
        }
        return setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        throw e;
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

    return errors;
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
            return dinheiroService.deleteConta(id).then((response) => {
              history.push('/contas');
            });
          },
        },
      ],
    });
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Contas" defaultHref="/contas" />
      <IonContent>
        <IonGrid>
          {!loading && conta && (
            <Formik
              initialValues={{
                id: conta.id,
                nome: conta.nome,
                cor_id: conta.cor.id,
                icone: conta.icone,
                saldo_inicial: conta.saldo_inicial,
              }}
              onSubmit={(values, functions) => handleSubmit(values, functions)}
              validate={(values) => handleValidate(values)}
            >
              {({ isSubmitting, submitForm }) => (
                <Form>
                  <IonRow class="ion-margin-top">
                    <IonCol size-lg="4" offset-lg="4" size-md="8" offset-md="2">
                      <ContasForm conta={conta} />
                    </IonCol>
                  </IonRow>
                  <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton disabled={isSubmitting} onClick={submitForm}>
                      <IonIcon icon={checkmark} />
                    </IonFabButton>
                  </IonFab>
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
