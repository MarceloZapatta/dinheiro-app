import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { addOutline } from 'ionicons/icons';
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';

import Header from '../../components/Header';

import Dinheiro, {
  Categoria,
  CategoriasResponse,
} from '../../services/DinheiroService';
import CorIcone from '../../components/cor-icone/CorIcone';
import ButtonAdicionar from '../../components/button-adicionar/ButtonAdicionar';

export default function Categorias(): JSX.Element {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const history = useHistory();

  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    const dinheiro = new Dinheiro();
    const response: CategoriasResponse = await dinheiro.getCategorias();
    setCategorias(response.data);
  }

  return (
    <IonPage data-testid="login-page">
      <Header titulo="Categorias" disableBackButton />
      <IonContent>
        <IonGrid>
          <IonRow class="ion-margin-top">
            <IonCol size-lg="6" offset-lg="3" size-md="8" offset-md="2">
              <IonList>
                {categorias.length <= 0 && (
                  <IonItem>
                    <IonLabel>Nenhuma categoria encontrada.</IonLabel>
                  </IonItem>
                )}
                {categorias.map((categoria) => (
                  <IonItem
                    button
                    routerLink={`/categorias/editar/${categoria.id}`}
                  >
                    <IonLabel>
                      <CorIcone
                        cor={categoria.cor.hexadecimal}
                        icone={categoria.icone}
                      />
                    </IonLabel>
                    <IonLabel>{categoria.nome}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <ButtonAdicionar
        action={() => history.push('/categorias/adicionar')}
        icon={addOutline}
      />
    </IonPage>
  );
}
