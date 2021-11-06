import React, { useEffect, useState } from 'react';
import { IonList, IonItem, IonContent, IonModal } from '@ionic/react';
import DinheiroService, {
  Categoria,
  CategoriasResponse,
} from '../../services/DinheiroService';
import CorIcone from '../cor-icone/CorIcone';

interface CategoriasModalProps {
  show: boolean;
  selecionarCategoria: (cor: Categoria) => void;
  onDidDismiss: () => void;
}

export default function CoresModal(props: CategoriasModalProps): JSX.Element {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    fetchCores();
  }, []);

  async function fetchCores() {
    const dinheiro = new DinheiroService();
    const response: CategoriasResponse = await dinheiro.getCategorias();
    setCategorias(response.data);
  }

  function handleSelecionarCategoria(categoria: Categoria) {
    const { selecionarCategoria } = props;
    selecionarCategoria(categoria);
  }

  const { show, onDidDismiss } = props;

  return (
    <IonContent>
      <IonModal isOpen={show} id="cor-modal" onDidDismiss={onDidDismiss}>
        <IonList id="categorias-modal">
          {categorias.map((categoria: Categoria) => (
            <IonItem
              onClick={() => handleSelecionarCategoria(categoria)}
              button
              key={categoria.id}
            >
              <CorIcone
                cor={categoria.cor.hexadecimal}
                icone={categoria.icone}
              />
              <span className="ion-margin-start">{categoria.nome}</span>
            </IonItem>
          ))}
        </IonList>
      </IonModal>
    </IonContent>
  );
}
