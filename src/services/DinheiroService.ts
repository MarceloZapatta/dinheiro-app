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

export interface Categoria {
  id: number;
  nome: string;
  cor: Cor;
  icone: string;
}

export interface CategoriaStore {
  id?: number;
  nome: string;
  // eslint-disable-next-line camelcase
  cor_id: number;
}

export interface CategoriasResponse extends Omit<DinheiroResponse, 'data'> {
  data: Categoria[];
}

export interface CategoriaResponse extends Omit<DinheiroResponse, 'data'> {
  data: Categoria | null;
}

export interface Movimentacao {
  id: number;
  descricao: string;
  observacoes: string;
  conta: Conta;
  categoria: Categoria;
  // eslint-disable-next-line camelcase
  data_transacao: string;
  valor: number;
}

export interface MovimentacaoStore {
  id?: number;
  descricao: string;
  observacoes: string;
  valor: number;
  // eslint-disable-next-line camelcase
  data_transacao: string;
  // eslint-disable-next-line camelcase
  conta_id: number;
  // eslint-disable-next-line camelcase
  categoria_id: number;
}

export interface MovimentacoesResponse extends Omit<DinheiroResponse, 'data'> {
  data: Movimentacao[];
}

export interface MovimentacaoResponse extends Omit<DinheiroResponse, 'data'> {
  data: Movimentacao | null;
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
        if (error.response.status === 401 && window.location.pathname !== '/') {
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

  storeConta(conta: ContaStore): Promise<ContaResponse> {
    return axios
      .post<ContaResponse>(`${this.baseUrl}v1/contas`, conta)
      .then((response) => response.data);
  }

  updateConta(conta: ContaStore): Promise<ContaResponse> {
    return axios
      .put<ContaResponse>(`${this.baseUrl}v1/contas/${conta.id}`, conta)
      .then((response) => response.data);
  }

  async getConta(id: number): Promise<ContaResponse> {
    return axios
      .get<ContaResponse>(`${this.baseUrl}v1/contas/${id}`)
      .then((response) => response.data);
  }

  async deleteConta(id: number): Promise<ContasResponse> {
    return axios
      .delete<ContasResponse>(`${this.baseUrl}v1/contas/${id}`)
      .then((response) => response.data);
  }

  async getCategorias(): Promise<CategoriasResponse> {
    return axios
      .get<CategoriasResponse>(`${this.baseUrl}v1/categorias`)
      .then((response) => response.data)
      .catch((error: AxiosError) => ({
        sucesso: false,
        mensagem: error.message,
        status_codigo: Number(error.code),
        data: [],
      }));
  }

  storeCategoria(conta: CategoriaStore): Promise<CategoriaResponse> {
    return axios
      .post<CategoriaResponse>(`${this.baseUrl}v1/categorias`, conta)
      .then((response) => response.data);
  }

  updateCategoria(conta: CategoriaStore): Promise<CategoriaResponse> {
    return axios
      .put<CategoriaResponse>(`${this.baseUrl}v1/categorias/${conta.id}`, conta)
      .then((response) => response.data);
  }

  async getCategoria(id: number): Promise<CategoriaResponse> {
    return axios
      .get<CategoriaResponse>(`${this.baseUrl}v1/categorias/${id}`)
      .then((response) => response.data);
  }

  async deleteCategoria(id: number): Promise<CategoriasResponse> {
    return axios
      .delete<CategoriasResponse>(`${this.baseUrl}v1/categorias/${id}`)
      .then((response) => response.data);
  }

  async getMovimentacoes(values: any): Promise<MovimentacoesResponse> {
    return axios
      .get<MovimentacoesResponse>(
        `${this.baseUrl}v1/movimentacoes?${this.buildParams(values).toString()}`
      )
      .then((response) => response.data)
      .catch((error: AxiosError) => ({
        sucesso: false,
        mensagem: error.message,
        status_codigo: Number(error.code),
        data: [],
      }));
  }

  storeMovimentacao(conta: MovimentacaoStore): Promise<MovimentacaoResponse> {
    return axios
      .post<MovimentacaoResponse>(`${this.baseUrl}v1/movimentacoes`, conta)
      .then((response) => response.data);
  }

  updateMovimentacao(
    movimentacao: MovimentacaoStore
  ): Promise<MovimentacaoResponse> {
    return axios
      .put<MovimentacaoResponse>(
        `${this.baseUrl}v1/movimentacoes/${movimentacao.id}`,
        movimentacao
      )
      .then((response) => response.data);
  }

  async getMovimentacao(id: number): Promise<MovimentacaoResponse> {
    return axios
      .get<MovimentacaoResponse>(`${this.baseUrl}v1/movimentacoes/${id}`)
      .then((response) => response.data);
  }

  async deleteMovimentacao(id: number): Promise<MovimentacoesResponse> {
    return axios
      .delete<MovimentacoesResponse>(`${this.baseUrl}v1/movimentacoes/${id}`)
      .then((response) => response.data);
  }

  // eslint-disable-next-line class-methods-use-this
  buildParams(data: any): URLSearchParams {
    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        Object.entries(value).forEach(([keyArray, valueArray]) =>
          params.append(`${key}[]`, String(valueArray))
        );
      } else params.append(key, String(value));
    });

    return params;
  }
}
