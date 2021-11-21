import axios, {
  AxiosError,
  AxiosRequestConfig,
  CancelTokenSource,
} from 'axios';
import { CadastrarValues } from '../pages/auth/Cadastrar';
import { ClientesValues } from '../pages/clientes/ClientesAdicionar';
import {
  Convite,
  Pessoa,
} from '../pages/organizacoes/OrganizacacaoPerfilPessoas';
import { OrganizacaoAdicionarValues } from '../pages/organizacoes/OrganizacaoAdicionar';
import { OrganizacaoPerfilValues } from '../pages/organizacoes/OrganizacaoPerfil';

interface DinheiroResponse {
  sucesso: boolean;
  // eslint-disable-next-line camelcase
  status_codigo?: number;
  data: Record<string, unknown>;
  mensagem: string;
  erros?: Record<string, unknown>[];
  meta?: Record<string, unknown>[];
}

export interface Organizacao {
  id: number;
  nome: string;
  email: string;
  hash: string;
  tipo: {
    id: number;
    tipo: string;
  };
  pessoas: Pessoa[];
  convites: Convite[];
  // eslint-disable-next-line camelcase
  razao_social: string;
  documento: string;
  cep: string;
  cidade: string;
  complemento: string;
  numero: string;
  rua: string;
  telefone: string;
  // eslint-disable-next-line camelcase
  uf_id: string;
}

export type OrganizacaoStore = Omit<OrganizacaoPerfilValues, 'id'>;

export interface OrganizacoesResponse extends Omit<DinheiroResponse, 'data'> {
  data: Organizacao[];
}
export interface OrganizacaoResponse extends Omit<DinheiroResponse, 'data'> {
  data: Organizacao | null;
}

export interface Integracao {
  id: number;
  nome: string;
}
export interface IntegracaoDados {
  id: number;
  dados: any;
  integracao: Integracao;
}

export interface IntegracaoDadosResponse
  extends Omit<DinheiroResponse, 'data'> {
  data: IntegracaoDados[];
}

export interface IntegracaoJunoLinkCadastroResponse
  extends Omit<DinheiroResponse, 'data'> {
  data: { url: string };
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
  cliente: Cliente;
  descricao: string;
  observacoes: string;
  conta: Conta;
  categoria: Categoria;
  // eslint-disable-next-line camelcase
  data_transacao: string;
  valor: number;
  cobranca?: Cobranca;
}

export interface Cobranca {
  id: number;
  // eslint-disable-next-line camelcase
  valor_pago: number;
  // eslint-disable-next-line camelcase
  data_pagamento: string;
  // eslint-disable-next-line camelcase
  data_cancelameto: string;
  status: string;
  // eslint-disable-next-line camelcase
  checkout_url: string;
  // eslint-disable-next-line camelcase
  fatura_url: string;
  // eslint-disable-next-line camelcase
  pix_imagem_base_64: string;
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

export interface MovimentacoesResponse
  extends Omit<DinheiroResponse, 'data' | 'meta'> {
  data: Movimentacao[];
  meta?: {
    saldo: number;
    // eslint-disable-next-line camelcase
    saldo_previsto: number;
  };
}

export interface MovimentacaoResponse extends Omit<DinheiroResponse, 'data'> {
  data: Movimentacao | null;
}

export interface Endereco {
  rua: string;
  numero: string;
  complemento: string;
  cidade: string;
  uf: Uf;
  cep: string;
}
export interface Cliente {
  id: number;
  nome: string;
  documento: string;
  email: string;
  endereco: Endereco;
}

export interface ClienteStore extends Omit<Cliente, 'id'> {
  id?: number;
}

export interface ClientesResponse
  extends Omit<DinheiroResponse, 'data' | 'meta'> {
  data: Cliente[];
  meta?: {
    saldo: number;
    // eslint-disable-next-line camelcase
    saldo_previsto: number;
  };
}

export interface ClienteResponse extends Omit<DinheiroResponse, 'data'> {
  data: Cliente | null;
}

export interface Cor {
  id: number;
  nome: string;
  hexadecimal: string;
}

export interface CoresResponse extends Omit<DinheiroResponse, 'data'> {
  data: Cor[];
}
export interface Uf {
  id: number;
  nome: string;
  sigla: string;
}

export interface UfsResponse extends Omit<DinheiroResponse, 'data'> {
  data: Uf[];
}

export default class DinheiroService {
  cancelToken: CancelTokenSource | null;

  constructor() {
    this.cancelToken = null;

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
        if (
          error.response &&
          error.response.status === 401 &&
          window.location.pathname !== '/'
        ) {
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

  async getOrganizacoes(): Promise<OrganizacoesResponse> {
    return axios
      .get<OrganizacoesResponse>(`${this.baseUrl}v1/organizacoes`)
      .then((response) => response.data)
      .catch((error: AxiosError) => ({
        sucesso: false,
        mensagem: error.message,
        status_codigo: Number(error.code),
        data: [],
      }));
  }

  async getIntegracoes(): Promise<IntegracaoDadosResponse> {
    return axios
      .get<IntegracaoDadosResponse>(
        `${this.baseUrl}v1/organizacoes/integracoes`
      )
      .then((response) => response.data);
  }

  async getLinkCadastroJuno(): Promise<IntegracaoJunoLinkCadastroResponse> {
    return axios
      .get<IntegracaoJunoLinkCadastroResponse>(
        `${this.baseUrl}v1/organizacoes/integracoes/juno/link-cadastrar`
      )
      .then((response) => response.data);
  }

  async getOrganizacao(): Promise<OrganizacaoResponse> {
    return axios
      .get<OrganizacaoResponse>(`${this.baseUrl}v1/organizacoes/dados`)
      .then((response) => response.data);
  }

  async updateOrganizacao(
    values: OrganizacaoStore
  ): Promise<OrganizacaoResponse> {
    return axios
      .put<OrganizacaoResponse>(`${this.baseUrl}v1/organizacoes`, values)
      .then((response) => response.data);
  }

  async storeOrganizacao(
    values: OrganizacaoAdicionarValues
  ): Promise<OrganizacaoResponse> {
    return axios
      .post<OrganizacaoResponse>(`${this.baseUrl}v1/organizacoes`, values)
      .then((response) => response.data);
  }

  async deleteOrganizacao(): Promise<OrganizacaoResponse> {
    return axios
      .delete<OrganizacaoResponse>(`${this.baseUrl}v1/organizacoes`)
      .then((response) => response.data);
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

  storeMovimentacao(
    movimentacao: MovimentacaoStore
  ): Promise<MovimentacaoResponse> {
    return axios
      .post<MovimentacaoResponse>(
        `${this.baseUrl}v1/movimentacoes`,
        movimentacao
      )
      .then((response) => response.data);
  }

  storeCobranca(
    movimentacao: MovimentacaoStore
  ): Promise<MovimentacaoResponse> {
    return axios
      .post<MovimentacaoResponse>(
        `${this.baseUrl}v1/movimentacoes/emitir-cobranca`,
        movimentacao
      )
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

  async getClientes(
    values: any,
    cancelToken: CancelTokenSource
  ): Promise<ClientesResponse> {
    return axios
      .get<ClientesResponse>(
        `${this.baseUrl}v1/clientes?${this.buildParams(values).toString()}`,
        {
          cancelToken: cancelToken.token,
        }
      )
      .then((response) => response.data)
      .catch((error: AxiosError) => ({
        sucesso: false,
        mensagem: error.message,
        status_codigo: Number(error.code),
        data: [],
      }));
  }

  storeCliente(conta: ClientesValues): Promise<ClienteResponse> {
    return axios
      .post<ClienteResponse>(`${this.baseUrl}v1/clientes`, conta)
      .then((response) => response.data);
  }

  updateCliente(cliente: ClienteStore): Promise<ClienteResponse> {
    return axios
      .put<ClienteResponse>(`${this.baseUrl}v1/clientes/${cliente.id}`, cliente)
      .then((response) => response.data);
  }

  async getCliente(id: number): Promise<ClienteResponse> {
    return axios
      .get<ClienteResponse>(`${this.baseUrl}v1/clientes/${id}`)
      .then((response) => response.data);
  }

  async deleteCliente(id: number): Promise<ClientesResponse> {
    return axios
      .delete<ClientesResponse>(`${this.baseUrl}v1/clientes/${id}`)
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

  async aceitarConvite(token: string): Promise<DinheiroResponse> {
    return axios
      .post<DinheiroResponse>(`${this.baseUrl}v1/organizacoes/convite`, {
        token,
      })
      .then((response) => response.data);
  }

  async deletePessoaVinculada(id: number): Promise<DinheiroResponse> {
    return axios
      .delete<DinheiroResponse>(`${this.baseUrl}v1/organizacoes/pessoas/${id}`)
      .then((response) => response.data);
  }

  async deleteConvitePendente(id: number): Promise<DinheiroResponse> {
    return axios
      .delete<DinheiroResponse>(`${this.baseUrl}v1/organizacoes/convites/${id}`)
      .then((response) => response.data);
  }

  async getUfs(): Promise<UfsResponse> {
    return axios
      .get<UfsResponse>(`${this.baseUrl}v1/ufs`)
      .then((response) => response.data);
  }
}
