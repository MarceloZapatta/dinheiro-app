import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { addOutline } from 'ionicons/icons';
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  IonList,
  IonItem,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';
import { Formik, Form } from 'formik';
import axios, { CancelTokenSource } from 'axios';
import Header from '../../components/Header';
import Dinheiro, { Cliente } from '../../services/DinheiroService';
import ButtonAdicionar from '../../components/button-adicionar/ButtonAdicionar';
import ClientesSkeleton from './ClientesSkeleton';
import './Clientes.scss';
import ClientesFiltroBusca from '../../components/clientes/ClientesFiltroBusca';

export interface ClientesFiltros {
  busca: string;
  // eslint-disable-next-line camelcase
  current_page: number;
}

export default function Clientes(): JSX.Element {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const history = useHistory();
  const formRef = useRef<any>();
  const [cancelToken, setCancelToken] = useState<CancelTokenSource | null>(
    null
  );
  const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);
  const [meta, setMeta] = useState<any>({ current_page: 1 });

  useEffect(() => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  }, []);

  async function fetchClientes(values: ClientesFiltros) {
    if (cancelToken) {
      cancelToken.cancel();
    }
    const newCancelToken = axios.CancelToken.source();
    setCancelToken(newCancelToken);

    const dinheiro = new Dinheiro();
    return dinheiro.getClientes(values, newCancelToken);
  }

  function handleSubmit(values: ClientesFiltros, { setSubmitting }: any) {
    fetchClientes(values)
      .then((response) => {
        if (response.meta) {
          setMeta(response.meta);
        }

        if (values.current_page > 1) {
          return setClientes((clientesAntigo) => [
            ...clientesAntigo,
            ...response.data,
          ]);
        }

        return setClientes(response.data);
      })
      .then(() => setSubmitting(false));
  }

  function handleOnIonInfinite(setFieldValue: any, submitForm: any) {
    setFieldValue('current_page', meta.current_page + 1);
    submitForm();
    setIsInfiniteDisabled(true);
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Clientes" disableBackButton />
      <IonContent>
        <Formik
          initialValues={{
            busca: '',
            current_page: meta.current_page,
          }}
          onSubmit={(values, functions) => handleSubmit(values, functions)}
          innerRef={formRef}
        >
          {({ values, isSubmitting, setFieldValue, submitForm }) => (
            <Form>
              <IonGrid>
                <IonRow class="ion-margin-top">
                  <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
                    <IonList>
                      <ClientesFiltroBusca />
                      {isSubmitting && values.current_page === 1 ? (
                        <ClientesSkeleton />
                      ) : (
                        clientes.map((cliente) => (
                          <IonItem
                            button
                            key={cliente.id}
                            routerLink={`/clientes/editar/${cliente.id}`}
                          >
                            <IonCol>
                              <IonLabel>{cliente.nome}</IonLabel>
                            </IonCol>
                            <IonCol>
                              <IonLabel>{cliente.email}</IonLabel>
                            </IonCol>
                            <IonCol>
                              <IonLabel>{cliente.documento}</IonLabel>
                            </IonCol>
                          </IonItem>
                        ))
                      )}
                      <IonItem>
                        <IonLabel>
                          {!isSubmitting && clientes.length <= 0
                            ? 'Nenhum cliente encontrado'
                            : ''}
                        </IonLabel>
                      </IonItem>
                    </IonList>
                    <IonInfiniteScroll
                      onIonInfinite={() =>
                        handleOnIonInfinite(setFieldValue, submitForm)
                      }
                      threshold="100px"
                      disabled={isInfiniteDisabled}
                    >
                      <IonInfiniteScrollContent loadingSpinner="circles" />
                    </IonInfiniteScroll>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </Form>
          )}
        </Formik>
      </IonContent>
      <ButtonAdicionar
        action={() => history.push('/clientes/adicionar')}
        icon={addOutline}
      />
    </IonPage>
  );
}
