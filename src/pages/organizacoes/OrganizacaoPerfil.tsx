import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonRow,
  IonGrid,
  IonCol,
  // useIonAlert,
} from '@ionic/react';

import { Form, Formik } from 'formik';
import { useHistory } from 'react-router';
import * as Yup from 'yup';
// import { exitOutline } from 'ionicons/icons';
import Header from '../../components/Header';
import OrganizacaoPerfilForm from './OrganizacaoPerfilForm';
import DinheiroService, { Organizacao } from '../../services/DinheiroService';
// import ButtonExcluir from '../../components/button-excluir/ButtonExcluir';
import ButtonAdicionar from '../../components/button-adicionar/ButtonAdicionar';

export interface OrganizacaoPerfilValues {
  id?: number;
  nome: string;
  email: string;
  // eslint-disable-next-line camelcase
  razao_social: string;
  documento: string;
  cep: string;
  cidade: string;
  complemento: string;
  numero: string;
  rua: string;
  telefone: string;
}

export interface OrganizacaoPerfilErrosValues {
  nome?: string;
  email?: string;
  // eslint-disable-next-line camelcase
  razao_social?: string;
  documento?: string;
  cep?: string;
  cidade?: string;
  complemento?: string;
  numero?: string;
  rua?: string;
  telefone?: string;
}

export default function OrganizacaoPerfilEditar(): JSX.Element {
  // const [present] = useIonAlert();
  const [organizacao, setOrganizacao] = useState<Organizacao>();
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizacao();
  }, []);

  function handleSubmit(
    values: OrganizacaoPerfilValues,
    { setSubmitting, setErrors }: any
  ) {
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .updateOrganizacao(values)
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

  function fetchOrganizacao() {
    setLoading(true);
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .getOrganizacao()
      .then((response) => {
        if (response.data) {
          setOrganizacao(response.data);
        }
        return setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        throw e;
      });
  }

  // function handleExcluir() {
  //   return present({
  //     header: 'Atenção',
  //     message: 'Essa ação não poderá ser revertida, deseja realmente excluir?',
  //     buttons: [
  //       'Cancelar',
  //       {
  //         text: 'Ok',
  //         handler: () => {
  //           const dinheiroService = new DinheiroService();
  //           return dinheiroService.deleteOrganizacao().then((response) => {
  //             history.push('/organizacoes');
  //           });
  //         },
  //       },
  //     ],
  //   });
  // }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Perfil da organização" defaultHref="/movimentacoes" />

      {!loading && organizacao && (
        <Formik
          initialValues={{
            nome: organizacao.nome,
            email: organizacao.email,
            razao_social: organizacao.razao_social,
            documento: organizacao.documento,
            uf_id: organizacao.uf_id,
            cep: organizacao.cep,
            cidade: organizacao.cidade,
            complemento: organizacao.complemento,
            numero: organizacao.numero,
            rua: organizacao.rua,
            telefone: organizacao.telefone,
            convite_novos: [],
          }}
          validationSchema={Yup.object().shape({
            convite_novos: Yup.array().of(
              Yup.string()
                .email('O e-mail é inválido.')
                .required('O e-mail é obrigatório')
            ),
          })}
          onSubmit={(values, functions) => handleSubmit(values, functions)}
        >
          {({ isSubmitting, submitForm }) => (
            <>
              <IonContent>
                <IonGrid>
                  <>
                    <Form>
                      <IonRow class="ion-margin-top">
                        <IonCol
                          size-lg="6"
                          offset-lg="3"
                          size-md="8"
                          offset-md="2"
                        >
                          <OrganizacaoPerfilForm organizacao={organizacao} />
                        </IonCol>
                      </IonRow>
                    </Form>
                  </>
                </IonGrid>
              </IonContent>
              <ButtonAdicionar
                action={() => submitForm()}
                isSubmitting={isSubmitting}
              />
              {/* <ButtonExcluir
                action={() => handleExcluir()}
                icon={exitOutline}
              /> */}
            </>
          )}
        </Formik>
      )}
    </IonPage>
  );
}
