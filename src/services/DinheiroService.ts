import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { CadastrarValues } from '../pages/auth/Cadastrar';

interface DinheiroResponse {
  sucesso: boolean;
  // eslint-disable-next-line camelcase
  status_codigo?: number;
  data: Record<string, unknown>;
  mensagem: string;
  erros?: Record<string, unknown>[];
}

export interface Organizacao {
  nome: string;
  hash: string;
  tipo: {
    id: number;
    tipo: string;
  };
}

export interface OrganizacaoResponse extends Omit<DinheiroResponse, 'data'> {
  data: Organizacao[];
}

export default class DinheiroService {
  constructor() {
    axios.interceptors.request.use((config: AxiosRequestConfig) => {
      if (config.headers) {
        config.headers.Accept = 'application/json';
        const token = localStorage.getItem('auth.token');

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    });
  }

  baseUrl = process.env.REACT_APP_URL_API;

  async login(email: string, senha: string): Promise<DinheiroResponse> {
    const formData = new FormData();

    formData.append('email', email);
    formData.append('senha', senha);

    return axios
      .post<DinheiroResponse>(`${this.baseUrl}v1/auth/login`, formData)
      .then((response) => response.data)
      .catch((error: AxiosError) => ({
        sucesso: false,
        mensagem: error.message,
        status_codigo: Number(error.code),
        data: {},
      }));
  }

  async cadastrar(values: CadastrarValues): Promise<DinheiroResponse> {
    const formData = new FormData();

    if (values.organizacaoTipoId) {
      formData.append('organizacao_tipo_id', String(values.organizacaoTipoId));
    }

    if (values.organizacaoTipoId === 2) {
      formData.append('nome_fantasia', String(values.nomeFantasia));
      formData.append('documento', String(values.documento));
    }

    formData.append('consultor', String(values.consultor));
    if (values.consultor) {
      formData.append('consultor_resumo', String(values.consultorResumo));
    }

    formData.append('nome', String(values.nome));
    formData.append('email', String(values.email));
    formData.append('senha', String(values.senha));

    return axios
      .post<DinheiroResponse>(`${this.baseUrl}v1/auth/cadastrar`, formData)
      .then((response) => response.data);
  }

  // eslint-disable-next-line class-methods-use-this
  transformDinheiroErros(erros: any): any {
    const formikErros: any = {};
    const keyErros = Object.keys(erros);

    for (let index = 0; index < keyErros.length; index += 1) {
      const key = keyErros[index];
      const erro = erros[key][0];
      formikErros[key] = erro;
    }

    return formikErros;
  }

  async getOrganizacoes(): Promise<OrganizacaoResponse> {
    return axios
      .get<OrganizacaoResponse>(`${this.baseUrl}v1/organizacoes`)
      .then((response) => response.data)
      .catch((error: AxiosError) => ({
        sucesso: false,
        mensagem: error.message,
        status_codigo: Number(error.code),
        data: [],
      }));
  }
}
