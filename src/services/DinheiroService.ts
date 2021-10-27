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

export interface Conta {
  id: number;
  nome: string;
  cor: Cor;
  icone: string;
  saldo: number;
  // eslint-disable-next-line camelcase
  saldo_inicial: number;
}

export interface ContaStore {
  id?: number;
  nome: string;
  // eslint-disable-next-line camelcase
  cor_id: number;
  // eslint-disable-next-line camelcase
  saldo_inicial: number;
}

export interface ContasResponse extends Omit<DinheiroResponse, 'data'> {
  data: Conta[];
}

export interface ContaResponse extends Omit<DinheiroResponse, 'data'> {
  data: Conta | null;
}
export interface Cor {
  id: number;
  nome: string;
  hexadecimal: string;
}

export interface CoresResponse extends Omit<DinheiroResponse, 'data'> {
  data: Cor[];
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

        const organizacaoHash = localStorage.getItem('auth.organizacao.hash');

        if (organizacaoHash) {
          config.headers[`X-Organizacao-Hash`] = organizacaoHash;
        }
      }

      return config;
    });

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = '/';
        }

        return Promise.reject(error);
      }
    );
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

    const response = await axios.post<DinheiroResponse>(
      `${this.baseUrl}v1/auth/cadastrar`,
      formData
    );
    return response.data;
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

  async getContas(): Promise<ContasResponse> {
    return axios
      .get<ContasResponse>(`${this.baseUrl}v1/contas`)
      .then((response) => response.data)
      .catch((error: AxiosError) => ({
        sucesso: false,
        mensagem: error.message,
        status_codigo: Number(error.code),
        data: [],
      }));
  }

  async getCores(): Promise<CoresResponse> {
    return axios
      .get<CoresResponse>(`${this.baseUrl}v1/cores`)
      .then((response) => response.data)
      .catch((error: AxiosError) => ({
        sucesso: false,
        mensagem: error.message,
        status_codigo: Number(error.code),
        data: [],
      }));
  }

  storeConta(conta: ContaStore): Promise<ContaResponse> {
    return axios
      .post<ContaResponse>(`${this.baseUrl}v1/contas`, conta)
      .then((response) => response.data)
      .catch((error: AxiosError) => {
        return {
          sucesso: false,
          mensagem: error.message,
          status_codigo: Number(error.code),
          data: null,
        };
      });
  }

  updateConta(conta: ContaStore): Promise<ContaResponse> {
    return axios
      .put<ContaResponse>(`${this.baseUrl}v1/contas/${conta.id}`, conta)
      .then((response) => response.data)
      .catch((error: AxiosError) => {
        return {
          sucesso: false,
          mensagem: error.message,
          status_codigo: Number(error.code),
          data: null,
        };
      });
  }

  async getConta(id: number): Promise<ContaResponse> {
    return axios
      .get<ContaResponse>(`${this.baseUrl}v1/contas/${id}`)
      .then((response) => response.data)
      .catch((error: AxiosError) => {
        return {
          sucesso: false,
          mensagem: error.message,
          status_codigo: Number(error.code),
          data: null,
        };
      });
  }

  async deleteConta(id: number): Promise<ContasResponse> {
    return axios
      .delete<ContasResponse>(`${this.baseUrl}v1/contas/${id}`)
      .then((response) => response.data)
      .catch((error: AxiosError) => ({
        sucesso: false,
        mensagem: error.message,
        status_codigo: Number(error.code),
        data: [],
      }));
  }
}
