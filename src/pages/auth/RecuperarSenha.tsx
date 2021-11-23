import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSpinner,
  IonInput,
} from '@ionic/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import React from 'react';
import { useHistory, useParams } from 'react-router';
import Header from '../../components/Header';
import DinheiroService from '../../services/DinheiroService';

export interface RecuperarSenhaValues {
  senha: string;
  // eslint-disable-next-line camelcase
  confirmar_senha: string;
}

export default function RecuperarSenha(): JSX.Element {
  const history = useHistory();
  const params = useParams<{ token: string }>();

  function handleSubmit(
    values: RecuperarSenhaValues,
    { setSubmitting, setErrors }: any
  ) {
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .recuperarSenha(values)
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
          history.push(
            `/?sucesso=${encodeURI('A senha foi recuperada com sucesso!')}`
          );
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
    <IonPage data-testid="recuperarSenha-page">
      <Header titulo="Recuperar senha" disableBackButton />
      <IonContent>
        <IonGrid>
          <Formik
            initialValues={{
              token: params.token,
              senha: '',
              confirmar_senha: '',
            }}
            onSubmit={(values, functions) => handleSubmit(values, functions)}
            validationSchema={Yup.object().shape({
              senha: Yup.string().required('O senha é obrigatória'),
              confirmar_senha: Yup.string()
                .required('A confirmação da senha é obrigatória.')
                .oneOf([Yup.ref('senha'), null], 'As senhas devem ser iguais'),
            })}
          >
            {({ values, submitForm, handleChange, isSubmitting }) => (
              <Form>
                <IonRow class="ion-margin-top">
                  <IonCol size-lg="4" offset-lg="4" size-md="8" offset-md="2">
                    <IonList>
                      <IonItem>
                        <IonLabel position="floating">Senha</IonLabel>
                        <IonInput
                          type="password"
                          name="senha"
                          onIonChange={handleChange}
                        />
                      </IonItem>
                      <IonItem>
                        <IonLabel position="floating">
                          Confirmação senha
                        </IonLabel>
                        <IonInput
                          type="password"
                          name="confirmar_senha"
                          onIonChange={handleChange}
                        />
                      </IonItem>
                    </IonList>
                  </IonCol>
                </IonRow>
                <IonRow class="ion-margin-top">
                  <IonCol size-lg="4" offset-lg="4" size-md="8" offset-md="2">
                    <IonButton
                      title="Entrar"
                      expand="block"
                      data-testid="entrar-button"
                      onClick={() => submitForm()}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <IonSpinner /> : 'Recuperar senha'}
                    </IonButton>
                    <IonButton
                      title="Entrar"
                      expand="block"
                      data-testid="entrar-button"
                      onClick={() => history.push('/')}
                      disabled={isSubmitting}
                      fill="clear"
                    >
                      Voltar
                    </IonButton>
                  </IonCol>
                </IonRow>
              </Form>
            )}
          </Formik>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
