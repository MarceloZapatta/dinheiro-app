import React from 'react';
import { IonIcon } from '@ionic/react';
import * as ionIcons from 'ionicons/icons';
import './CorIcone.scss';

interface CorIconeProps {
  cor: string;
  icone: string;
}

export default function CorIcone(props: CorIconeProps): JSX.Element {
  const { cor, icone } = props;
  const icones: any = ionIcons;

  return (
    <div
      className={`cor-icone cor-icone--${cor}`}
      style={{
        backgroundColor: `#${cor}`,
      }}
    >
      <IonIcon icon={icones[icone]} />
    </div>
  );
}
