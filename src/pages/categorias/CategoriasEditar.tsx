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
import Header from '../../components/Header';
import CategoriasForm from './CategoriasForm';
import DinheiroService, { Categoria } from '../../services/DinheiroService';
import ButtonExcluir from '../../components/button-excluir/ButtonExcluir';
import { CategoriasValues, CategoriasErrosValues } from './CategoriasAdicionar';
import ButtonAdicionar from '../../components/button-adicionar/ButtonAdicionar';

export default function CategoriasEditar(): JSX.Element {
  const { id } = useParams();
  const [present] = useIonAlert();
  const [categoria, setCategoria] = useState<Categoria>();
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoria();
  }, []);

  function handleSubmit(
    values: CategoriasValues,
    { setSubmitting, setErrors }: any
  ) {
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .updateCategoria(values)
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
          history.push('/categorias');
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

  function fetchCategoria() {
    setLoading(true);
    const dinheiroService = new DinheiroService();
    return dinheiroService
      .getCategoria(id)
      .then((response) => {
        if (response.data) {
          setCategoria(response.data);
        }
        return setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        throw e;
      });
  }

  function handleValidate(values: CategoriasValues) {
    const errors: CategoriasErrosValues = {};

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
            return dinheiroService.deleteCategoria(id).then((response) => {
              history.push('/categorias');
            });
          },
        },
      ],
    });
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Categorias" defaultHref="/categorias" />
      <IonContent>
        <IonGrid>
          {!loading && categoria && (
            <Formik
              initialValues={{
                id: categoria.id,
                nome: categoria.nome,
                cor_id: categoria.cor.id,
                icone: categoria.icone,
              }}
              onSubmit={(values, functions) => handleSubmit(values, functions)}
              validate={(values) => handleValidate(values)}
            >
              {({ isSubmitting, submitForm }) => (
                <Form>
                  <IonRow class="ion-margin-top">
                    <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
                      <CategoriasForm categoria={categoria} />
                    </IonCol>
                  </IonRow>
                  <ButtonAdicionar
                    action={() => submitForm()}
                    isSubmitting={isSubmitting}
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
