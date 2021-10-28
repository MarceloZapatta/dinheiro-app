import React, { useEffect, useState } from 'react';
import { IonIcon, IonItem, IonLabel } from '@ionic/react';
import { useFormikContext } from 'formik';
import * as ionIcones from 'ionicons/icons';
import IconesModal from './IconesModal';
import './IconesInput.scss';
import ErrorField from '../ErrorField';
import { ContasValues } from '../../pages/contas/ContasAdicionar';

interface IconesInputProps {
  initialValue?: string;
  onChange: (icone: string) => void;
}

export default function IconesInput(props: IconesInputProps): JSX.Element {
  const [showIconeModal, setShowIconeModal] = useState(false);
  const [iconeSelecionado, setIconeSelecionada] = useState<string>();
  const { onChange, initialValue } = props;
  const { errors } = useFormikContext<ContasValues>();

  useEffect(() => {
    if (initialValue) {
      setIconeSelecionada(initialValue);
      onChange(initialValue);
    }
  }, []);

  function handleOnClick() {
    setShowIconeModal(true);
  }

  function handleIconeSelecionado(icone: string) {
    setIconeSelecionada(icone);
    setShowIconeModal(false);
    onChange(icone);
  }

  const icons: any = ionIcones;

  return (
    <>
      <IonItem onClick={() => handleOnClick()} className="icones-input" button>
        <IonLabel slot="start">Icone</IonLabel>
        <IonLabel slot="end" className="icone-thumb">
          {iconeSelecionado ? <IonIcon icon={icons[iconeSelecionado]} /> : null}
        </IonLabel>
      </IonItem>
      {errors.icone ? (
        <ErrorField mensagem={errors.icone} testid="icone-id-invaildo-text" />
      ) : null}
      <IconesModal
        show={showIconeModal}
        selecionarIcone={(icone) => handleIconeSelecionado(icone)}
        onDidDismiss={() => setShowIconeModal(false)}
      />
    </>
  );
}

IconesInput.defaultProps = {
  initialValue: undefined,
};
