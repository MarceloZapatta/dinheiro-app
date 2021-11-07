import { IonItem, IonLabel, IonSkeletonText } from '@ionic/react';
import React from 'react';

export default function MovimentacoesSkeleton(): JSX.Element {
  function renderItems(): JSX.Element[] {
    const items = [];
    for (let index = 0; index < 5; index += 1) {
      items.push(
        <IonItem>
          <IonLabel>
            <IonSkeletonText
              animated
              style={{ height: '30px', width: '30%' }}
            />
          </IonLabel>

          <IonLabel>
            <IonSkeletonText
              animated
              style={{ height: '30px', width: '35px', borderRadius: '50%' }}
            />
          </IonLabel>
          <IonLabel>
            <IonSkeletonText
              animated
              style={{ height: '35px', width: '50%' }}
            />
          </IonLabel>
          <IonLabel>
            <IonSkeletonText
              animated
              style={{ height: '30px', width: '100%' }}
            />
          </IonLabel>
        </IonItem>
      );
    }
    return items;
  }

  return <>{renderItems()}</>;
}
