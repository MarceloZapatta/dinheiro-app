import axios from 'axios';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  localidade: string;
  uf: string;
}

export default class ViaCepService {
  // eslint-disable-next-line class-methods-use-this
  async pesquisaCep(cep: number) {
    if (String(cep).length !== 8) {
      return null;
    }

    const instance = axios.create();

    return instance.get<ViaCepResponse>(`//viacep.com.br/ws/${cep}/json`, {
      headers: {},
    });
  }
}
