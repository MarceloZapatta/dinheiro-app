import React, { useState } from 'react';
import { IonInput } from '@ionic/react';
import VMasker from 'vanilla-masker';
import { InputChangeEventDetail } from '@ionic/core';

interface TextMaskProps {
  name: string;
  title: string;
  testid: string;
  color: string;
  initialValue: string | number;
  mask: string;
  onChange: (e: CustomEvent) => void;
}

export default function TextMask(props: TextMaskProps): JSX.Element {
  const { name, title, testid, initialValue, mask, color, onChange } = props;
  const [value, setValue] = useState(initialValue);

  function handleChange(e: CustomEvent<InputChangeEventDetail>) {
    const currentValue = e.detail.value;
    if (currentValue) {
      const currentValueNumbers = VMasker.toNumber(currentValue);
      e.detail.value = VMasker.toPattern(currentValueNumbers, mask);
      setValue(e.detail.value);
      onChange(e);
    }
  }

  return (
    <IonInput
      title={title}
      data-testid={testid}
      name={name}
      type="text"
      value={value}
      color={color}
      onIonChange={handleChange}
    />
  );
}
