import React from 'react';
import { IonItem, IonLabel, IonSkeletonText } from '@ionic/react';
import './MovimentacoesSaldos.scss';

interface MovimentacoesSaldosProps {
  saldo: number;
  saldoPrevisto: number;
  isLoading: boolean;
  hideSaldoPrevisto: boolean;
}

export default function MovimentacoesSaldos(
  props: MovimentacoesSaldosProps
): JSX.Element {
  const { saldo, saldoPrevisto, hideSaldoPrevisto, isLoading } = props;
  return (
    <IonItem>
      <IonLabel class="saldos">
        Saldo:{' '}
        {isLoading ? (
          <IonSkeletonText style={{ width: '10%', display: 'inline-block' }} />
        ) : (
          Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(saldo)
        )}
        {!hideSaldoPrevisto && (
          <>
            <br />
            Saldo previsto:{' '}
            {isLoading ? (
              <IonSkeletonText
                style={{ width: '20%', display: 'inline-block' }}
              />
            ) : (
              <>
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(saldoPrevisto)}{' '}
                <span
                  className={`valor ${
                    saldoPrevisto > saldo ? 'valor--success' : 'valor--danger'
                  }`}
                >
                  ({saldoPrevisto > saldo ? '+' : '-'}
                  {Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(Math.abs(saldoPrevisto - saldo))}
                  )
                </span>
              </>
            )}
          </>
        )}
      </IonLabel>
    </IonItem>
  );
}
