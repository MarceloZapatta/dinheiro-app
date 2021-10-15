import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  // IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonRouterLink,
  IonRow,
  IonSpinner,
  // IonText,
} from '@ionic/react';
import { Form, Formik } from 'formik';

import React from 'react';
import { useHistory } from 'react-router';
import CadastrarConsultorForm from '../../components/auth/cadastrar/CadastrarConsultorForm';
import CadastrarPessoaFisicaForm from '../../components/auth/cadastrar/CadastrarPessoaFisicaForm';
import CadastrarPessoaJuridicaForm from '../../components/auth/cadastrar/CadastrarPessoaJuridicaForm';
import ErrorField from '../../components/ErrorField';
// import { RouteComponentProps } from 'react-router';
// import ErrorField from '../../components/ErrorField';
import Header from '../../components/Header';
import DinheiroService from '../../services/DinheiroService';
// import Dinheiro from '../../services/Dinheiro';
// import store from '../../store';
// import { setShow } from '../../store/reducers/alertErroReducer';

// interface CadastrarState {
//   email: string;
//   senha: string;
//   nome: string;
//   emailInvalido: boolean;
//   senhaInvalida: boolean;
//   nomeInvalido: boolean;
//   emailJaUtilizado: boolean;
// }

export interface CadastrarValues {
  organizacaoTipoId?: number | string | null;
  documento?: string;
  nome?: string;
  nomeFantasia?: string;
  email?: string;
  senha?: string;
  confirmarSenha?: string;
  consultor?: number | string;
  consultorResumo?: string;
}

// interface CadastrarProps {
//   history: RouteComponentProps['history'];
// }

export default function Cadastrar(): JSX.Element {
  const history = useHistory();

  function handleSubmit(
    values: CadastrarValues,
    { setSubmitting, setErrors }: any
  ) {
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .cadastrar(values)
      .then((response) => {
        console.log(response, 'estou aaqq');
        if (response.sucesso !== true) {
          if (response.mensagem === 'Network request failed') {
            response.mensagem = 'Erro de conexão. Tente novamente mais tarde.';
          }

          if (response.status_codigo === 422 && response.erros) {
            console.log(response.status_codigo, response.erros);
            if (Object.keys(response.erros).length > 0) {
              setErrors(dinheiroService.transformDinheiroErros(response.erros));
            }
          }
        } else {
          history.push('/verificacao-email');
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

  function handleValidate(values: CadastrarValues) {
    const erros: CadastrarValues = {};

    if (!values.organizacaoTipoId) {
      erros.organizacaoTipoId = 'O tipo de pessoa é obrigatório.';
    }

    if (values.organizacaoTipoId === 1) {
      if (!values.nome) {
        erros.nome = 'O nome é obrigatório.';
      }
    } else if (values.organizacaoTipoId === 2) {
      if (!values.nomeFantasia) {
        erros.nomeFantasia = 'O nome fantasia é obrigatório.';
      } else if (!values.documento) {
        erros.documento = 'O CNPJ é obrigatório.';
      } else if (!values.nome) {
        erros.nome = 'O nome do responsável é obrigatório.';
      }
    } else {
      erros.organizacaoTipoId = 'O campo é obrigatório.';
    }

    if (!values.email) {
      erros.email = 'O e-mail é obrigatório.';
    } else if (!/\S+@\S+/.test(values.email)) {
      erros.email = 'O e-mail é inválido.';
    } else if (!values.senha) {
      erros.senha = 'A senha é obrigatória.';
    } else if (!values.confirmarSenha) {
      erros.confirmarSenha = 'A confirmação da senha é obrigatória.';
    } else if (values.senha !== values.confirmarSenha) {
      erros.senha = 'As senhas não correspondem.';
      erros.confirmarSenha = 'As senhas não correspondem.';
    }

    if (values.consultor !== 1 && values.consultor !== 0) {
      erros.consultor = 'O campo é obrigatório.';
    }

    if (values.consultor && !values.consultorResumo) {
      erros.consultorResumo = 'O resumo é obrigatório';
    }

    return erros;
  }

  return (
    <IonPage data-testid="cadastrar-page">
      <Header titulo="Cadastrar" disableBackButton />
      <IonContent>
        <IonGrid>
          <Formik
            initialValues={{
              organizacaoTipoId: null,
              nome: '',
              email: '',
              senha: '',
              confirmarSenha: '',
              nomeFantasia: '',
              documento: '',
            }}
            onSubmit={handleSubmit}
            validate={handleValidate}
          >
            {({ values, errors, handleChange, isSubmitting }) => (
              <Form>
                <IonRow class="ion-margin-top">
                  <IonCol size-lg="4" offset-lg="4" size-md="8" offset-md="2">
                    <IonList>
                      <IonRadioGroup
                        name="organizacaoTipoId"
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
                    {errors.organizacaoTipoId ? (
                      <ErrorField
                        mensagem={errors.organizacaoTipoId}
                        testid="organizacao-tipo-id-invaildo-text"
                      />
                    ) : null}
                  </IonCol>
                </IonRow>
                {values.organizacaoTipoId && (
                  <>
                    <IonRow>
                      <IonCol
                        size-lg="4"
                        offset-lg="4"
                        size-md="8"
                        offset-md="2"
                      >
                        {values.organizacaoTipoId === 1 ? (
                          <CadastrarPessoaFisicaForm />
                        ) : (
                          <CadastrarPessoaJuridicaForm />
                        )}
                      </IonCol>
                    </IonRow>
                    <IonRow class="ion-margin-top">
                      <IonCol
                        size-lg="4"
                        offset-lg="4"
                        size-md="8"
                        offset-md="2"
                      >
                        <IonList>
                          <IonRadioGroup
                            name="consultor"
                            onIonChange={handleChange}
                          >
                            <IonListHeader>
                              <IonLabel>
                                Deseja se cadastrar como consultor financeiro?
                              </IonLabel>
                            </IonListHeader>
                            <IonItem>
                              <IonLabel>Sim</IonLabel>
                              <IonRadio slot="start" value={1} />
                            </IonItem>
                            <IonItem>
                              <IonLabel>Não</IonLabel>
                              <IonRadio slot="start" value={0} />
                            </IonItem>
                          </IonRadioGroup>
                        </IonList>
                        {errors.consultor ? (
                          <ErrorField
                            mensagem={errors.consultor}
                            testid="consultor-invalido-text"
                          />
                        ) : null}
                        {values.consultor === 1 && <CadastrarConsultorForm />}
                      </IonCol>
                    </IonRow>
                  </>
                )}
                <IonRow>
                  <IonCol size-lg="4" offset-lg="4" size-md="8" offset-md="2">
                    <IonButton
                      title="Cadastrar"
                      expand="block"
                      data-testid="cadastrar-button"
                      type="submit"
                      disabled={isSubmitting}
                      className="ion-margin-top"
                      // onClick={() => this.cadastrar()}
                    >
                      {isSubmitting ? <IonSpinner /> : 'Cadastrar'}
                    </IonButton>
                    <IonRouterLink routerLink="/">
                      <IonButton
                        title="Cadastrar"
                        expand="block"
                        fill="clear"
                        data-testid="possui-conta-button"
                      >
                        Já possui conta? Entrar!
                      </IonButton>
                    </IonRouterLink>
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
