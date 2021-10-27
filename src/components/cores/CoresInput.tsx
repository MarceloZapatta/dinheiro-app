import React, { useEffect, useState } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { useFormikContext } from 'formik';
import CoresModal from './CoresModal';
import './CoresInput.scss';
import { Cor } from '../../services/DinheiroService';
import ErrorField from '../ErrorField';
import { ContasValues } from '../../pages/contas/ContasAdicionar';

interface CoresInputInterface {
  initialValue?: Cor | null;
  onChange: (corId: number) => void;
}

export default function CoresInput(props: CoresInputInterface): JSX.Element {
  const { onChange, initialValue } = props;
  const [showCorModal, setShowCorModal] = useState(false);
  const [corSelecionada, setCorSelecionada] = useState<Cor>();
  const { errors } = useFormikContext<ContasValues>();

  useEffect(() => {
    if (initialValue) {
      setCorSelecionada(initialValue);
      onChange(initialValue.id);
    }
  }, []);

  function handleOnClick() {
    setShowCorModal(true);
  }

  function handleCorSelecionada(cor: Cor) {
    setCorSelecionada(cor);
    setShowCorModal(false);
    onChange(cor.id);
  }

  function toSnakeCase(string: string): string {
    return string
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join('_');
  }

  return (
    <>
      <IonItem onClick={() => handleOnClick()} className="cores-input" button>
        <IonLabel slot="start">Cor</IonLabel>
        <IonLabel slot="end">
          {corSelecionada ? (
            <div
              className={`holder-color cor-${toSnakeCase(corSelecionada.nome)}`}
            />
          ) : null}
        </IonLabel>
      </IonItem>
      {errors.cor_id ? (
        <ErrorField mensagem={errors.cor_id} testid="cor-id-invaildo-text" />
      ) : null}
      <CoresModal
        show={showCorModal}
        selecionarCor={(cor) => handleCorSelecionada(cor)}
        onDidDismiss={() => setShowCorModal(false)}
      />
    </>
  );
}

CoresInput.defaultProps = {
  initialValue: null,
};
