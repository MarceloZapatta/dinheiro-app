import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router';
import { AuthContext } from '../../App';

interface PrivateRouteProps {
  exact?: boolean;
  path: string;
  children: JSX.Element;
}

export default function PrivateRoute(props: PrivateRouteProps): JSX.Element {
  const authContext = useContext(AuthContext);
  const { children, exact, path } = props;

  function handleRenderPrivateRoute() {
    if (authContext.logado) {
      return authContext.organizacaoSelecionada ||
        path === '/organizacoes/selecionar' ? (
        children
      ) : (
        <Redirect to="/organizacoes/selecionar" />
      );
    }
    return <Redirect to="/" />;
  }

  return (
    <Route
      exact={exact}
      path={path}
      render={() => handleRenderPrivateRoute()}
    />
  );
}

PrivateRoute.defaultProps = {
  exact: true,
};
