import React, { useState, useRef, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { Form, Formik } from 'formik';
import moment from 'moment';
import Header from '../../components/Header';
import RelatorioMovimentacoesCategoria from './RelatorioMovimentacoesCategoria';
import RelatorioMovimentacoes from './RelatorioMovimentacoes';
import MovimentacaoFiltroPeriodo from '../../components/movimentacoes/MovimentacaoFiltroPeriodo';
import DinheiroService, {
  DashboardMovimentacoesAnual,
  DashboardPorCategoria,
} from '../../services/DinheiroService';

export default function Relatorios(): JSX.Element {
  const [dashboardPorCategoria, setDashboardPorCategoria] =
    useState<DashboardPorCategoria>();
  const [dashboardMovimentacoesAnual, setDashboardMovimentacoesAnual] =
    useState<DashboardMovimentacoesAnual>();
  const formRef = useRef<any>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  }, []);

  function handleSubmit(values: any, { setSubmitting }: any) {
    const dinheiroService = new DinheiroService();
    if (
      values.tipo_relatorio === 'receitas-categoria' ||
      values.tipo_relatorio === 'despesas-categoria'
    ) {
      dinheiroService
        .getDashboardPorCategoria({
          data_inicio: values.data_inicio,
          data_fim: values.data_fim,
          tipo:
            values.tipo_relatorio === 'despesas-categoria'
              ? 'despesas'
              : 'receitas',
        })
        .then((response) => setDashboardPorCategoria(response.data))
        .then(() => setSubmitting(false));
    } else {
      dinheiroService
        .getDashboardMovimentacoesAnual({
          data_inicio: values.data_inicio,
          data_fim: values.data_fim,
        })
        .then((response) => setDashboardMovimentacoesAnual(response.data))
        .then(() => setSubmitting(false));
    }
  }

  return (
    <IonPage>
      <Header titulo="Dashboards" defaultHref="/movimentacoes" />
      <IonContent>
        <IonGrid>
          <Formik
            innerRef={formRef}
            initialValues={{
              tipo_relatorio: 'despesas-categoria',
              data_inicio: moment().startOf('month').format('DD/MM/YYYY'),
              data_fim: moment().endOf('month').format('DD/MM/YYYY'),
            }}
            onSubmit={(values, functions) => handleSubmit(values, functions)}
          >
            {({ values, submitForm, handleChange, isSubmitting }) => (
              <Form>
                <IonRow>
                  <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
                    <IonItem>
                      <IonLabel position="stacked">Dashboard</IonLabel>
                      <IonSelect
                        name="tipo_relatorio"
                        value={values.tipo_relatorio}
                        onIonChange={(e) => {
                          handleChange(e);
                          submitForm();
                        }}
                        interface="popover"
                        disabled={isSubmitting}
                      >
                        <IonSelectOption value="despesas-categoria">
                          Despesas por categoria
                        </IonSelectOption>
                        <IonSelectOption value="receitas-categoria">
                          Receitas por categoria
                        </IonSelectOption>
                        <IonSelectOption value="movimentacoes">
                          Movimentações anual
                        </IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
                    <MovimentacaoFiltroPeriodo
                      anual={values.tipo_relatorio === 'movimentacoes'}
                    />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
                    {values.tipo_relatorio === 'movimentacoes'
                      ? dashboardMovimentacoesAnual && (
                          <RelatorioMovimentacoes
                            data={dashboardMovimentacoesAnual}
                          />
                        )
                      : dashboardPorCategoria && (
                          <RelatorioMovimentacoesCategoria
                            data={{
                              ...dashboardPorCategoria,
                            }}
                          />
                        )}
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
