import React, { useState } from 'react';
import {
  IonList,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonIcon,
  IonInput,
  IonButton,
  useIonAlert,
} from '@ionic/react';
import { add, close, trash } from 'ionicons/icons';
import { useFormikContext } from 'formik';
import ErrorField from '../../components/ErrorField';
import DinheiroService from '../../services/DinheiroService';

export interface Pessoa {
  id: number;
  nome: string;
  email: string;
}

export interface Convite {
  id: number;
  email: string;
}

interface OrganizacaoPerfilPessoasProps {
  pessoas: Pessoa[];
  convites: Convite[];
}

export default function OrganizacaoPerfilPessoas(
  props: OrganizacaoPerfilPessoasProps
): JSX.Element {
  const { pessoas, convites } = props;
  const [pessoasAtual, setPessoasAtual] = useState(pessoas);
  const [convitesAtual, setConvitesAtual] = useState(convites);
  const { handleChange, setFieldValue, setValues, values, errors } =
    useFormikContext<any>();
  const [present] = useIonAlert();

  const handleClick = () => {
    setFieldValue(`convite_novos[${values.convite_novos.length}]`, '');
  };

  const handleDelete = (email: string) => {
    setValues({
      ...values,
      convite_novos: [...values.convite_novos].filter(
        (conviteNovo) => conviteNovo !== email
      ),
    });
  };

  function handleExcluirPessoa(id: number) {
    return present({
      header: 'Atenção',
      message:
        'Essa ação não poderá ser revertida, deseja realmente remover a pessoa vinculada?',
      buttons: [
        'Cancelar',
        {
          text: 'Ok',
          handler: () => {
            const dinheiroService = new DinheiroService();
            return dinheiroService.deletePessoaVinculada(id).then(() => {
              setPessoasAtual((pessoasAtualAntigo) =>
                pessoasAtualAntigo.filter(
                  (pessoaAtualAntigo) => pessoaAtualAntigo.id !== id
                )
              );
            });
          },
        },
      ],
    });
  }

  function handleExcluirConvite(id: number) {
    return present({
      header: 'Atenção',
      message:
        'Essa ação não poderá ser revertida, deseja realmente remover o convite pendente?',
      buttons: [
        'Cancelar',
        {
          text: 'Ok',
          handler: () => {
            const dinheiroService = new DinheiroService();
            return dinheiroService.deleteConvitePendente(id).then(() => {
              setConvitesAtual((convitesAtualAntigo) =>
                convitesAtualAntigo.filter(
                  (conviteAtualAntigo) => conviteAtualAntigo.id !== id
                )
              );
            });
          },
        },
      ],
    });
  }

  return (
    <IonList>
      {pessoasAtual.length > 0 && (
        <IonItemDivider>
          <IonLabel>Pessoas vinculadas</IonLabel>
        </IonItemDivider>
      )}
      {pessoasAtual.map((pessoa: Pessoa) => (
        <IonItem key={pessoa.id}>
          <IonLabel>
            {pessoa.nome}
            <br />
            <small>{pessoa.email}</small>
          </IonLabel>
          <IonButton
            fill="clear"
            slot="end"
            color="tertiary"
            onClick={() => handleExcluirPessoa(pessoa.id)}
          >
            <IonIcon icon={trash} />
          </IonButton>
        </IonItem>
      ))}
      {convitesAtual.length > 0 && (
        <IonItemDivider>
          <IonLabel>Convites pendentes</IonLabel>
        </IonItemDivider>
      )}
      {convitesAtual.map((convite: Convite) => (
        <IonItem key={convite.id}>
          {convite.email}
          <IonButton
            fill="clear"
            slot="end"
            color="tertiary"
            onClick={() => handleExcluirConvite(convite.id)}
          >
            <IonIcon icon={trash} />
          </IonButton>
        </IonItem>
      ))}
      <IonItemDivider>
        <IonLabel>Convidar pessoas</IonLabel>
      </IonItemDivider>
      {values.convite_novos
        .filter((conviteNovo: any) => conviteNovo !== undefined)
        .map((conviteNovo: Convite, index: number) => (
          <>
            <IonItem key={conviteNovo.email}>
              <IonLabel position="floating">E-mail</IonLabel>
              <IonInput
                type="email"
                name={`convite_novos[${index}]`}
                value={
                  values.convite_novos ? values.convite_novos[index] || '' : ''
                }
                onIonChange={handleChange}
              />
              <IonButton
                fill="clear"
                slot="end"
                className="ion-margin-top"
                color="tertiary"
                onClick={() => handleDelete(values.convite_novos[index])}
              >
                <IonIcon slot="icon-only" icon={close} />
              </IonButton>
            </IonItem>
            {errors.convite_novos &&
            Array.isArray(errors.convite_novos) &&
            errors.convite_novos[index] ? (
              <ErrorField
                mensagem={String(errors.convite_novos[index])}
                testid="convites-novos-invaildo-text"
              />
            ) : null}
          </>
        ))}
      <IonItem button onClick={() => handleClick()} className="ion-text-center">
        <IonLabel>
          <IonIcon slot="icon-only" icon={add} color="primary" />
        </IonLabel>
      </IonItem>
    </IonList>
  );
}
