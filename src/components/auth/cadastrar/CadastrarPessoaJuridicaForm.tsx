import { IonInput, IonItem, IonLabel } from '@ionic/react';
import React from 'react';
import { useFormikContext } from 'formik';
import ErrorField from '../../ErrorField';
import TextMask from '../../TextMask';

interface CadastrarPessoaJuridicaFormValues {
  nome?: string;
  nomeFantasia?: string;
  documento?: string;
  email?: string;
  senha?: string;
  confirmarSenha?: string;
}

export default function CadastrarPessoaJuridicaForm(): JSX.Element {
  const { errors, handleChange } = useFormikContext<
    CadastrarPessoaJuridicaFormValues
  >();

  return (
    <>
      <IonItem>
        <IonLabel position="floating">Nome fantasia</IonLabel>
        <IonInput
          name="nomeFantasia"
          type="text"
          title="Nome"
          color={errors.nomeFantasia ? 'danger' : ''}
          data-testid="nome-input"
          onIonChange={handleChange}
        />
      </IonItem>
      {errors.nomeFantasia ? (
        <ErrorField
          mensagem={errors.nomeFantasia}
          testid="nome-fantasia-invaildo-text"
        />
      ) : null}
      <IonItem>
        <IonLabel position="floating">CNPJ</IonLabel>
        <TextMask
          name="documento"
          title="Nome"
          color={errors.documento ? 'danger' : ''}
          testid="cnpj-input"
          initialValue=""
          mask="99.999.999/9999-99"
          onChange={handleChange}
        />
      </IonItem>
      {errors.documento ? (
        <ErrorField
          mensagem={errors.documento}
          testid="documento-invalido-text"
        />
      ) : null}
      <IonItem>
        <IonLabel position="floating">Nome responsável</IonLabel>
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
        <ErrorField mensagem={errors.nome} testid="nome-invaildo-text" />
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
