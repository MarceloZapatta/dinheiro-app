import React, { useEffect, useState } from 'react';
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
  Movimentacao,
  MovimentacoesResponse,
} from '../../services/DinheiroService';
import CorIcone from '../../components/cor-icone/CorIcone';
import ButtonAdicionar from '../../components/button-adicionar/ButtonAdicionar';
import MovimentacaoFiltroPeriodo from '../../components/movimentacoes/MovimentacaoFiltroPeriodo';

export default function Movimentacoes(): JSX.Element {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const history = useHistory();

  useEffect(() => {
    const values = {
      data_inicio: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      data_fim: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
    };
    fetchMovimentacoes(values);
  }, []);

  async function fetchMovimentacoes(values: any) {
    const dinheiro = new Dinheiro();
    const response: MovimentacoesResponse = await dinheiro.getMovimentacoes(
      values
    );
    setMovimentacoes(response.data);
  }

  function handleSubmit(values: any, { setSubmitting }: any) {
    fetchMovimentacoes(values).then(setSubmitting(false));
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Movimentações" disableBackButton />
      <IonContent>
        <Formik
          initialValues={{
            data_inicio: moment()
              .startOf('month')
              .format('YYYY-MM-DD HH:mm:ss'),
            data_fim: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
          }}
          onSubmit={(values, functions) => handleSubmit(values, functions)}
        >
          {() => (
            <Form>
              <IonGrid>
                <IonRow class="ion-margin-top">
                  <IonCol size-lg="4" offset-lg="4" size-md="8" offset-md="2">
                    <IonList>
                      <MovimentacaoFiltroPeriodo />
                      {movimentacoes.map((movimentacao) => (
                        <IonItem
                          button
                          key={movimentacao.id}
                          routerLink={`/movimentacoes/editar/${movimentacao.id}`}
                        >
                          <IonLabel>
                            {moment(
                              movimentacao.data_transacao,
                              'DD/MM/YYYY'
                            ).format('DD/MM')}
                          </IonLabel>
                          <IonLabel>
                            <CorIcone
                              cor={movimentacao.categoria.cor.hexadecimal}
                              icone={movimentacao.categoria.icone}
                            />
                          </IonLabel>
                          <IonLabel>{movimentacao.descricao}</IonLabel>
                          <IonLabel slot="end" className="ion-text-right">
                            {Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(movimentacao.valor)}
                          </IonLabel>
                        </IonItem>
                      ))}
                    </IonList>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </Form>
          )}
        </Formik>
      </IonContent>
      <ButtonAdicionar
        action={() => history.push('/movimentacoes/adicionar')}
        icon={addOutline}
      />
    </IonPage>
  );
}
