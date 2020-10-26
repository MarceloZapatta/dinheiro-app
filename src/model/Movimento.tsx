export default class Movimento {
  id: number;
  descricao: string;
  valor: number;
  data: Date;

  constructor(id: number, valor: number, descricao: string, data: Date) {
    this.id = id;
    this.descricao = descricao;
    this.valor = valor;
    this.data = data;
  }
}
