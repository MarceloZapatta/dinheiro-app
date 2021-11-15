import React from 'react';
import { ChartData } from 'chart.js';
import { Pie } from 'react-chartjs-2';

interface RelatorioMovimentacoesCategoriaProps {
  receita?: boolean;
  data: ChartData<'pie'>;
}

export default function RelatorioMovimentacoesCategoria(
  props: RelatorioMovimentacoesCategoriaProps
): JSX.Element {
  const { receita, data } = props;

  return receita ? <Pie data={data} /> : <Pie data={data} />;
}

RelatorioMovimentacoesCategoria.defaultProps = {
  receita: false,
};
