import React from 'react';

import { IonInput, IonItem, IonLabel } from '@ionic/react';

interface InputProps {
  change: any;
}

export default class Input extends React.Component<InputProps> {
  // isInputInvalido(): boolean {
  //   return true;
  // }

  renderInputInvalido(): any {
    return this.props;
  }

  render(): JSX.Element {
    const { change } = this.props;

    return (
      <>
        <IonItem>
          <IonLabel position="floating">Nome</IonLabel>
          <IonInput
            type="text"
            title="Nome"
            // color={this.isInputInvalido() ? 'danger' : ''}
            data-testid="nome-input"
            onIonChange={(e) => change(e)}
          />
        </IonItem>
        {this.renderInputInvalido()}
      </>
    );
  }
}
