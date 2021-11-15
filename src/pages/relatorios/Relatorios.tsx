import React, { useState } from 'react';
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
import Header from '../../components/Header';
import RelatorioMovimentacoesCategoria from './RelatorioMovimentacoesCategoria';
import RelatorioMovimentacoes from './RelatorioMovimentacoes';

export default function Relatorios(): JSX.Element {
  const [relatorio, setRelatorio] = useState('despesas');

  function handleOnIonChange(e: any) {
    setRelatorio(e.detail.value);
  }

  return (
    <IonPage>
      <Header titulo="Relatórios" defaultHref="/movimentacoes" />
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
              <IonItem>
                <IonLabel position="stacked">Relatório</IonLabel>
                <IonSelect
                  value={relatorio}
                  onIonChange={(e) => handleOnIonChange(e)}
                  interface="popover"
                >
                  <IonSelectOption value="despesas-categoria">
                    Despesas por categoria
                  </IonSelectOption>
                  <IonSelectOption value="receitas-categoria">
                    Receitas por categoria
                  </IonSelectOption>
                  <IonSelectOption value="movimentacoes">
                    Movimentações
                  </IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
              {relatorio === 'movimentacoes' ? (
                <RelatorioMovimentacoes
                  data={{
                    labels: [
                      'Janeiro',
                      'Fevereiro',
                      'Março',
                      'Abril',
                      'Maio',
                      'Junho',
                      'Julho',
                      'Agosto',
                      'Setembro',
                      'Outubro',
                      'Novembro',
                      'Dezembro',
                    ],
                    datasets: [
                      {
                        label: 'Receitas',
                        data: [
                          12, 13, 20, 19, 40, 50, 60, 40, 19, 29, 32, 11, 12,
                        ],
                        backgroundColor: '#00ff5f',
                        borderWidth: 0,
                      },
                      {
                        label: 'Despesas',
                        data: [
                          23, 10, 40, 30, 20, 10, 20, 10, 14, 50, 10, 5, 5,
                        ],
                        backgroundColor: '#ff4961',
                        borderWidth: 0,
                      },
                    ],
                  }}
                />
              ) : (
                <RelatorioMovimentacoesCategoria
                  receita={relatorio === 'receitas-categoria'}
                  data={{
                    labels: ['Alimentação', 'Escola', 'Pagamentos', 'Lazer'],
                    datasets: [
                      {
                        data: [12, 13, 20, 19],
                        backgroundColor: [
                          '#bcf6cdff',
                          '#2e9bd6ff',
                          '#fcf6b1ff',
                          '#f7b32bff',
                        ],
                        borderWidth: 0,
                      },
                    ],
                  }}
                />
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
