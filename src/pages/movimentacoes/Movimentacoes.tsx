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
} from '@ionic/react';

import { Formik, Form } from 'formik';
import moment from 'moment';
import Header from '../../components/Header';

import Dinheiro, {
  Categoria,
  Conta,
  Movimentacao,
} from '../../services/DinheiroService';
import ButtonAdicionar from '../../components/button-adicionar/ButtonAdicionar';
import MovimentacaoFiltroPeriodo from '../../components/movimentacoes/MovimentacaoFiltroPeriodo';
import MovimentacoesSkeleton from './MovimentacoesSkeleton';
import ButtonFiltrar from '../../components/button-filtrar/ButtonFiltrar';
import MovimentacaoFiltros from '../../components/movimentacoes/MovimentacaoFiltros';
import CategoriaContainer from '../../components/categorias/CategoriaContainer';
import ContaContainer from '../../components/contas/ContaContainer';

export interface MovimentacoesFiltros {
  // eslint-disable-next-line camelcase
  data_inicio?: string;
  // eslint-disable-next-line camelcase
  data_fim?: string;
  categorias?: Categoria[];
  contas?: Conta[];
}

export default function Movimentacoes(): JSX.Element {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [showModalMovimentacaoFiltros, setShowModalMovimentacaoFiltros] =
    useState(false);
  const history = useHistory();
  const formRef = useRef<any>();

  useEffect(() => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  }, []);

  async function fetchMovimentacoes(values: any) {
    const dinheiro = new Dinheiro();
    return dinheiro.getMovimentacoes(values);
  }

  function handleSubmit(values: any, { setSubmitting }: any) {
    fetchMovimentacoes({
      data_inicio: values.data_inicio,
      data_fim: values.data_fim,
      categorias: values.categorias.map((categoria: Categoria) => categoria.id),
      contas: values.contas.map((conta: Conta) => conta.id),
    })
      .then((response) => setMovimentacoes(response.data))
      .then(() => setSubmitting(false));
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Movimentações" disableBackButton />
      <IonContent>
        <Formik
          initialValues={{
            data_inicio: moment().startOf('month').format('DD/MM/YYYY'),
            data_fim: moment().endOf('month').format('DD/MM/YYYY'),
            categorias: [],
            contas: [],
          }}
          onSubmit={(values, functions) => handleSubmit(values, functions)}
          innerRef={formRef}
        >
          {({ isSubmitting }) => (
            <Form>
              <IonGrid>
                <IonRow class="ion-margin-top">
                  <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
                    <IonList>
                      <MovimentacaoFiltroPeriodo />
                      {isSubmitting ? (
                        <MovimentacoesSkeleton />
                      ) : (
                        movimentacoes.map((movimentacao) => (
                          <IonItem
                            button
                            key={movimentacao.id}
                            routerLink={`/movimentacoes/editar/${movimentacao.id}`}
                          >
                            <IonCol size="auto">
                              <IonLabel>
                                <small>
                                  {moment(
                                    movimentacao.data_transacao,
                                    'DD/MM/YYYY'
                                  ).format('DD/MM')}
                                </small>
                              </IonLabel>
                            </IonCol>
                            <IonCol sizeXs="3" size="2">
                              <IonLabel>
                                <CategoriaContainer
                                  categoria={movimentacao.categoria}
                                  small
                                />
                                <ContaContainer
                                  conta={movimentacao.conta}
                                  small
                                />
                              </IonLabel>
                            </IonCol>
                            <IonCol sizeXs="3" size="4">
                              <IonLabel>
                                <small>{movimentacao.descricao}</small>
                              </IonLabel>
                            </IonCol>
                            <IonCol size="5" className="ion-text-right">
                              <small className="ion-margin-end">
                                {Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(movimentacao.valor)}
                              </small>
                            </IonCol>
                          </IonItem>
                        ))
                      )}
                      <IonItem>
                        <IonLabel>
                          {!isSubmitting && movimentacoes.length <= 0
                            ? 'Nenhuma movimentação encontrada'
                            : ''}
                        </IonLabel>
                      </IonItem>
                    </IonList>
                  </IonCol>
                </IonRow>
              </IonGrid>
              <MovimentacaoFiltros
                isOpen={showModalMovimentacaoFiltros}
                onDidDismiss={() => setShowModalMovimentacaoFiltros(false)}
              />
            </Form>
          )}
        </Formik>
      </IonContent>
      <ButtonFiltrar action={() => setShowModalMovimentacaoFiltros(true)} />
      <ButtonAdicionar
        action={() => history.push('/movimentacoes/adicionar')}
        icon={addOutline}
      />
    </IonPage>
  );
}
