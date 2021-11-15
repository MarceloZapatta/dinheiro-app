import React from 'react';
import { ChartData } from 'chart.js';
import { Bar } from 'react-chartjs-2';

interface RelatorioMovimentacoesProps {
  data: ChartData<'bar'>;
}

export default function RelatorioMovimentacoes(
  props: RelatorioMovimentacoesProps
): JSX.Element {
  const { data } = props;
  return <Bar data={data} />;
}
