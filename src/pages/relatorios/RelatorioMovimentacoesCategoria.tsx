import React from 'react';
import { ChartData } from 'chart.js';
import { Pie } from 'react-chartjs-2';

interface RelatorioMovimentacoesCategoriaProps {
  data: ChartData<'pie'>;
}

export default function RelatorioMovimentacoesCategoria(
  props: RelatorioMovimentacoesCategoriaProps
): JSX.Element {
  const { data } = props;

  return <Pie data={data} />;
}
