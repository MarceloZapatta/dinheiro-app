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
import ClientesForm from './ClientesForm';
import DinheiroService, { Cliente } from '../../services/DinheiroService';
import ButtonExcluir from '../../components/button-excluir/ButtonExcluir';
import ButtonAdicionar from '../../components/button-adicionar/ButtonAdicionar';

export default function ClientesEditar(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [present] = useIonAlert();
  const [cliente, setCliente] = useState<Cliente>();
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCliente();
  }, []);

  function handleSubmit(values: any, { setSubmitting, setErrors }: any) {
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .updateCliente(values)
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

  function fetchCliente() {
    setLoading(true);
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .getCliente(Number(id))
      .then((response) => {
        if (response.data) {
          setCliente(response.data);
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
              .deleteCliente(Number(id))
              .then((response) => {
                history.push('/clientes');
              });
          },
        },
      ],
    });
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Clientes" defaultHref="/clientes" />
      {!loading && cliente && (
        <Formik
          initialValues={{
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            documento: cliente.documento,
            endereco: {
              rua: cliente.endereco.rua,
              numero: cliente.endereco.numero,
              complemento: cliente.endereco.complemento,
              cidade: cliente.endereco.cidade,
              uf_id: cliente.endereco.uf.id,
              cep: cliente.endereco.cep,
            },
          }}
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
              <ButtonExcluir action={() => handleExcluir()} />
              <ButtonAdicionar
                isSubmitting={isSubmitting}
                action={() => submitForm()}
              />
            </IonContent>
          )}
        </Formik>
      )}
    </IonPage>
  );
}
