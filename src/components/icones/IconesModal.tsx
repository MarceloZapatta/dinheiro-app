import React, { useEffect, useState } from 'react';
import {
  IonItem,
  IonContent,
  IonModal,
  IonIcon,
  IonCol,
  IonRow,
} from '@ionic/react';
import * as ionIcons from 'ionicons/icons';

interface IconesModalProps {
  show: boolean;
  selecionarIcone: (icone: string) => void;
  onDidDismiss: () => void;
}

export default function IconesModal(props: IconesModalProps): JSX.Element {
  const [icones, setIcones] = useState<string[]>([]);

  useEffect(() => {
    fetchIcones();
  }, []);

  async function fetchIcones() {
    const iconesStrings = [
      'airplane',
      'analytics',
      'bag',
      'bagHandle',
      'barChart',
      'barbell',
      'bed',
      'beer',
      'bicycle',
      'boat',
      'body',
      'bonfire',
      'book',
      'briefcase',
      'brush',
      'build',
      'bus',
      'business',
      'cafe',
      'calculator',
      'car',
      'card',
      'cart',
      'colorPalette',
      'construct',
      'dice',
      'earth',
      'fastFood',
      'fish',
      'flash',
      'flask',
      'hardwareChip',
      'heart',
      'iceCream',
      'language',
      'location',
      'map',
      'medkit',
      'mic',
      'musicalNotes',
      'navigate',
      'paw',
      'rocket',
      'shield',
      'storefront',
      'logoBitcoin',
      'logoAmazon',
      'logoAndroid',
      'logoApple',
      'logoAppleAppstore',
      'logoSteam',
    ];
    setIcones(iconesStrings);
  }

  function handleSelecionarIcone(icone: string) {
    const { selecionarIcone } = props;
    selecionarIcone(icone);
  }

  const { show, onDidDismiss } = props;
  const icons: any = ionIcons;

  return (
    <IonContent>
      <IonModal isOpen={show} id="icone-modal" onDidDismiss={onDidDismiss}>
        <IonRow>
          {icones.map((icone: string) => (
            <IonCol size="2" key={icone}>
              <IonItem onClick={() => handleSelecionarIcone(icone)} button>
                <IonIcon icon={icons[icone]} style={{ margin: 'auto' }} />
              </IonItem>
            </IonCol>
          ))}
        </IonRow>
      </IonModal>
    </IonContent>
  );
}
