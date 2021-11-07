import React, { useRef } from 'react';
import {
  IonContent,
  IonModal,
  IonList,
  IonHeader,
  IonToolbar,
  IonItem,
  IonButtons,
  IonButton,
} from '@ionic/react';
import { useFormikContext } from 'formik';
import CategoriasSelect from '../categorias/CategoriasSelect';
import { MovimentacoesFiltros } from '../../pages/movimentacoes/Movimentacoes';
import ContasSelect from '../contas/ContasSelect';

interface MovimentacaoFiltrosProps {
  isOpen: boolean;
  onDidDismiss: () => void;
}

export default function MovimentacaoFiltros(
  props: MovimentacaoFiltrosProps
): JSX.Element {
  const { isOpen, onDidDismiss } = props;
  const { values, setFieldValue, submitForm } =
    useFormikContext<MovimentacoesFiltros>();
  const modalRef = useRef<HTMLIonModalElement>(null);

  function handleLimpar() {
    setFieldValue('contas', []);
    setFieldValue('categorias', []);
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
  }

  function handleOk() {
    submitForm();
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
  }

  return (
    <IonModal
      isOpen={isOpen}
      ref={modalRef}
      onDidDismiss={() => onDidDismiss()}
    >
      <IonHeader translucent>
        <IonToolbar>
          <IonItem>Selecione os filtros</IonItem>
          <IonButtons slot="end">
            <IonButton onClick={() => handleLimpar()}>Limpar</IonButton>
            <IonButton onClick={() => handleOk()} color="primary">
              OK
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <CategoriasSelect
            initialValue={values.categorias}
            onChange={(e) => setFieldValue('categorias', e)}
          />
          <ContasSelect
            initialValue={values.contas}
            onChange={(e) => setFieldValue('contas', e)}
          />
        </IonList>
      </IonContent>
    </IonModal>
  );
}
