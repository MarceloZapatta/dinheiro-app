import React, { useEffect, useState, useRef } from 'react';
import {
  IonList,
  IonItem,
  IonContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/react';
import { useFormikContext } from 'formik';
import DinheiroService, {
  Categoria,
  CategoriasResponse,
} from '../../services/DinheiroService';
import CorIcone from '../cor-icone/CorIcone';

interface CategoriasModalProps {
  show: boolean;
  multiple?: boolean;
  initialValue?: Categoria[] | null;
  selecionarCategoria?: (categoria: Categoria) => void;
  selecionarCategorias?: (categorias: Categoria[]) => void;
  onDidDismiss: () => void;
}

export default function CategoriasModal(
  props: CategoriasModalProps
): JSX.Element {
  const [categoriaSelecionadas, setCategoriaSelecionadas] = useState<
    Categoria[]
  >([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const modalRef = useRef<HTMLIonModalElement>(null);
  const { setFieldValue } = useFormikContext();
  const { initialValue } = props;

  useEffect(() => {
    fetchCores();
    if (initialValue) {
      setCategoriaSelecionadas(initialValue);
    }
  }, []);

  async function fetchCores() {
    const dinheiro = new DinheiroService();
    const response: CategoriasResponse = await dinheiro.getCategorias();
    setCategorias(response.data);
  }

  function handleSelecionarCategoria(categoria: Categoria) {
    const { selecionarCategoria, multiple } = props;
    return multiple
      ? setCategoriaSelecionadas((categoriasSelecionadas) => {
          const categoriaJaSelecionada = categoriasSelecionadas.find(
            (categoriaSelecionada) => categoriaSelecionada.id === categoria.id
          );
          return categoriaJaSelecionada
            ? [
                ...categoriaSelecionadas.filter(
                  (categoriaSelecionada) =>
                    categoriaSelecionada.id !== categoria.id
                ),
              ]
            : [...categoriasSelecionadas, categoria];
        })
      : selecionarCategoria && selecionarCategoria(categoria);
  }

  function handleOk() {
    const { selecionarCategorias } = props;
    return selecionarCategorias && selecionarCategorias(categoriaSelecionadas);
  }

  function handleLimpar() {
    setFieldValue('categorias', []);
    setCategoriaSelecionadas([]);
  }

  const { show, onDidDismiss } = props;

  return (
    <IonContent>
      <IonModal
        isOpen={show}
        id="cor-modal"
        onDidDismiss={onDidDismiss}
        ref={modalRef}
      >
        <IonHeader translucent>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={() => handleLimpar()}>Limpar</IonButton>
              <IonButton onClick={() => handleOk()} color="primary">
                OK
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList id="categorias-modal">
            {categorias.map((categoria: Categoria) => (
              <IonItem
                onClick={() => handleSelecionarCategoria(categoria)}
                button
                key={categoria.id}
              >
                <CorIcone
                  cor={categoria.cor.hexadecimal}
                  icone={
                    categoriaSelecionadas.find(
                      (categoriaSelecionada) =>
                        categoriaSelecionada.id === categoria.id
                    )
                      ? 'checkmark'
                      : categoria.icone
                  }
                />
                <span className="ion-margin-start">{categoria.nome}</span>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonModal>
    </IonContent>
  );
}

CategoriasModal.defaultProps = {
  multiple: false,
  initialValue: null,
  selecionarCategoria: () => null,
  selecionarCategorias: () => null,
};
