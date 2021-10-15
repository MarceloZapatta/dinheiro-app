import { IonInput, IonItem, IonLabel } from '@ionic/react';
import React from 'react';
import { useFormikContext } from 'formik';
import ErrorField from '../../ErrorField';

interface CadastrarPessoaFisicaFormValues {
  nome?: string;
  email?: string;
  senha?: string;
  confirmarSenha?: string;
}

export default function CadastrarPessoaFisicaForm(): JSX.Element {
  const { errors, handleChange } = useFormikContext<
    CadastrarPessoaFisicaFormValues
  >();

  return (
    <>
      <IonItem>
        <IonLabel position="floating">Nome</IonLabel>
        <IonInput
          name="nome"
          type="text"
          title="Nome"
          color={errors.nome ? 'danger' : ''}
          data-testid="nome-input"
          onIonChange={handleChange}
        />
      </IonItem>
      {errors.nome ? (
        <ErrorField mensagem={errors.nome} testid="nome-invalido-text" />
      ) : null}
      <IonItem>
        <IonLabel position="floating">E-mail</IonLabel>
        <IonInput
          name="email"
          type="email"
          title="E-mail"
          color={errors.email ? 'danger' : ''}
          data-testid="email-input"
          autofocus
          onIonChange={handleChange}
        />
      </IonItem>
      {errors.email ? (
        <ErrorField mensagem={errors.email} testid="email-invalido-text" />
      ) : null}
      <IonItem>
        <IonLabel position="floating">Senha</IonLabel>
        <IonInput
          name="senha"
          type="password"
          title="Senha"
          color={errors.senha ? 'danger' : ''}
          data-testid="senha-input"
          onIonChange={handleChange}
        />
      </IonItem>
      {errors.senha ? (
        <ErrorField mensagem={errors.senha} testid="senha-invalido-text" />
      ) : null}
      <IonItem>
        <IonLabel position="floating">Confirmar senha</IonLabel>
        <IonInput
          name="confirmarSenha"
          type="password"
          title="Confirmar senha"
          color={errors.confirmarSenha ? 'danger' : ''}
          data-testid="senha-input"
          onIonChange={handleChange}
        />
      </IonItem>
      {errors.confirmarSenha ? (
        <ErrorField
          mensagem={errors.confirmarSenha}
          testid="confirmar-senha-invalido-text"
        />
      ) : null}
    </>
  );
}
