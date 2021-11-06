import React, { useEffect, useState } from 'react';
import { IonInput } from '@ionic/react';
import VMasker from 'vanilla-masker';
import { InputChangeEventDetail } from '@ionic/core';

interface TextMaskProps {
  name: string;
  title: string;
  testid: string;
  color: string;
  initialValue: string | number;
  mask?: string;
  onChange: (e: CustomEvent) => void;
  money?: boolean;
  disabled?: boolean;
}

export default function TextMask(props: TextMaskProps): JSX.Element {
  const {
    name,
    title,
    testid,
    initialValue,
    mask,
    color,
    money,
    disabled,
    onChange,
  } = props;
  const [value, setValue] = useState(initialValue);

  function handleChange(e: CustomEvent<InputChangeEventDetail>) {
    const currentValue = e.detail.value;
    if (currentValue) {
      const currentValueNumbers = VMasker.toNumber(currentValue);

      if (money) {
        e.detail.value = VMasker.toMoney(currentValueNumbers, {
          precision: 2,
          separator: ',',
          delimiter: '.',
        });
      } else {
        e.detail.value = VMasker.toPattern(currentValueNumbers, mask);
      }

      setValue(e.detail.value);

      if (money) {
        e.detail.value = String(Number(currentValueNumbers) / 100);
      }

      onChange(e);
    }
  }

  function handleInitialValue() {
    const currentValueNumbers = VMasker.toNumber(initialValue);
    let currentValue = '';
    if (money) {
      currentValue = VMasker.toMoney(currentValueNumbers, {
        precision: 2,
        separator: ',',
        delimiter: '.',
      });
    } else {
      currentValue = VMasker.toPattern(currentValueNumbers, mask);
    }

    setValue(currentValue);
  }

  useEffect(() => handleInitialValue(), []);

  return (
    <IonInput
      title={title}
      data-testid={testid}
      name={name}
      type="text"
      value={`R$ ${value}`}
      color={color}
      onIonChange={(e) => handleChange(e)}
      disabled={disabled}
    />
  );
}

TextMask.defaultProps = {
  money: false,
  mask: '',
  disabled: false,
};
