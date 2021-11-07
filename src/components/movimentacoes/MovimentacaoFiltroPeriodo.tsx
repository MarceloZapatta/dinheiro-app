import React, { useState, useEffect, useRef } from 'react';
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonDatetime,
} from '@ionic/react';
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
  const dataRef = useRef<HTMLIonDatetimeElement>(null);
  const { setFieldValue, submitForm, isSubmitting } = useFormikContext();

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
    const novaData = dataAtual.clone().subtract(1, 'month');
    setDataAtual(novaData);
    setMesAtual(meses[dataAtual.month()]);
    setFieldValue(
      'data_inicio',
      novaData.clone().startOf('month').format('YYYY-MM-DD HH:mm:ss')
    );
    setFieldValue(
      'data_fim',
      novaData.clone().endOf('month').format('YYYY-MM-DD HH:mm:ss')
    );
    submitForm();
  }

  function handleChangeDate(e: any) {
    if (e.detail.value) {
      const data = moment(e.detail.value);
      setFieldValue(
        'data_inicio',
        data.clone().startOf('month').format('DD/MM/YYYY')
      );
      setFieldValue(
        'data_fim',
        data.clone().endOf('month').format('DD/MM/YYYY')
      );
      setDataAtual(data);
      submitForm();
    }
  }

  function handleClickData() {
    if (dataRef.current) {
      dataRef.current.open();
    }
  }

  return (
    <IonItem className="movimentacao-filtro-periodo">
      <IonButton
        fill="clear"
        color="tertiary"
        size="default"
        onClick={() => handleAnteriorMes()}
        disabled={isSubmitting}
      >
        <IonIcon
          icon={chevronBackOutline}
          slot="icon-only"
          className="icon-mudar-mes"
        />
      </IonButton>
      <IonLabel className="ion-text-center">
        <IonButton
          fill="clear"
          color="tertiary"
          onClick={() => handleClickData()}
        >
          {mesAtual} / {dataAtual.year()}
        </IonButton>
        <IonDatetime
          value={dataAtual.toISOString()}
          hidden
          onIonChange={(e) => handleChangeDate(e)}
          pickerFormat="MMMM/YYYY"
          max="2100"
          monthNames={meses}
          ref={dataRef}
          cancelText="Cancelar"
          doneText="OK"
        />
      </IonLabel>
      <IonButton
        fill="clear"
        color="tertiary"
        size="default"
        onClick={() => handleProximoMes()}
        disabled={isSubmitting}
      >
        <IonIcon
          icon={chevronForwardOutline}
          slot="icon-only"
          className="icon-mudar-mes"
        />
      </IonButton>
    </IonItem>
  );
}
