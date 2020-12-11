import store from '../store';
import { setShow } from '../store/reducers/alertErroReducer';

export default class Dinheiro {
  baseUrl = process.env.REACT_APP_URL_API || '';

  login(email: string, password: string): Promise<Record<string, unknown>> {
    const formData = new FormData();

    formData.append('email', email);
    formData.append('password', password);

    return fetch(`${this.baseUrl}v1/auth/login`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        if (!error.response) {
          store.dispatch(
            setShow({
              show: true,
              mensagem:
                'Não foi possível conectar, tente novamente mais tarde.',
            })
          );

          return false;
        }

        return error.json();
      });
  }
}
