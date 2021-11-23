import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import React from 'react';
import { IonList, IonListHeader, IonItem } from '@ionic/react';
import DinheiroService from '../../services/DinheiroService';

interface ImportacaoPopoverProps {
  onHide: () => void;
  openModalImportacaoExcel: () => void;
  history: any;
}

export default function ImportacaoPopover(
  props: ImportacaoPopoverProps
): JSX.Element {
  const { onHide, openModalImportacaoExcel, history } = props;
  function handleOnClickCodigoBarras() {
    BarcodeScanner.scan({
      orientation: 'landscape',
    })
      .then((barcodeData) => {
        if (barcodeData.text) {
          const dinheiroService = new DinheiroService();
          dinheiroService
            .importarCodigoBarras({
              codigo_barras: barcodeData.text,
            })
            .then((response: any) =>
              history.push(
                `/movimentacoes/importacoes/${response.data.movimentacao_importacao.id}`
              )
            );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <IonList>
      <IonListHeader>Importar</IonListHeader>
      <IonItem button onClick={() => openModalImportacaoExcel()}>
        Excel
      </IonItem>
      <IonItem button onClick={() => handleOnClickCodigoBarras()}>
        Código de barras
      </IonItem>
      <IonItem lines="none" detail={false} button onClick={() => onHide()}>
        Fechar
      </IonItem>
    </IonList>
  );
}
