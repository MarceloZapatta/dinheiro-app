interface DinheiroResponse {
  sucesso: boolean;
  statusCode: number;
  data: Record<string, unknown>;
  mensagem: string;
}

export default class Dinheiro {
  baseUrl = process.env.REACT_APP_URL_API;

  async login(email: string, senha: string): Promise<DinheiroResponse> {
    const formData = new FormData();

    formData.append('email', email);
    formData.append('senha', senha);

    try {
      const response = await fetch(`${this.baseUrl}v1/auth/login`, {
        method: 'POST',
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return {
        sucesso: false,
        mensagem: error.message,
        statusCode: error.statusCode,
        data: {},
      };
    }
  }

  async cadastrar(
    nome: string,
    email: string,
    senha: string
  ): Promise<DinheiroResponse> {
    const formData = new FormData();

    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('senha', senha);

    try {
      const response = await fetch(`${this.baseUrl}v1/auth/cadastrar`, {
        method: 'POST',
        body: formData,
      });

      return await response.json();
    } catch (error) {
      return {
        sucesso: false,
        mensagem: error.message,
        statusCode: error.statusCode,
        data: {},
      };
    }
  }
}
