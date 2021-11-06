import React, { useState, useEffect } from 'react';
import { IonItem, IonLabel, IonIcon } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { useFormikContext } from 'formik';
import moment from 'moment';

export default function MovimentacaoFiltroPeriodo(): JSX.Element {
  const meses = [
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
  ];
  const [mesAtual, setMesAtual] = useState('');
  const [dataAtual, setDataAtual] = useState(moment());
  const { setFieldValue, submitForm } = useFormikContext();

  useEffect(() => {
    setMesAtual(meses[dataAtual.month()]);
  }, [dataAtual]);

  function handleProximoMes() {
    setDataAtual(dataAtual.add(1, 'month'));
    setMesAtual(meses[dataAtual.month()]);
    setFieldValue(
      'data_inicio',
      dataAtual.startOf('month').format('YYYY-MM-DD HH:mm:ss')
    );
    setFieldValue(
      'data_fim',
      dataAtual.endOf('month').format('YYYY-MM-DD HH:mm:ss')
    );
    submitForm();
  }

  function handleAnteriorMes() {
    setDataAtual(dataAtual.subtract(1, 'month'));
    setMesAtual(meses[dataAtual.month()]);
  }

  return (
    <IonItem className="movimentacao-filtro-periodo">
      <IonIcon
        icon={chevronBackOutline}
        slot="start"
        className="icon-mudar-mes"
        onClick={() => handleAnteriorMes()}
      />
      <IonLabel className="ion-text-center">
        {mesAtual} / {dataAtual.year()}
      </IonLabel>
      <IonIcon
        icon={chevronForwardOutline}
        slot="end"
        className="icon-mudar-mes"
        onClick={() => handleProximoMes()}
      />
    </IonItem>
  );
}
