/* Modulos Externos ( ͡❛ ͜ʖ ͡❛) 👉 Subida Inicial */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ProveedorRedux } from 'react-redux';
import { ThemeProvider as ProveedorEstilos } from 'styled-components';
/* Modulos Internos */
import App from './App';
import crearAlmacen from './redux/almacen';
import tema from './theme';
import al from './utils/almacenLocal';
import './iifes/clase';
import './index.css';

export const almacen = crearAlmacen();

ReactDOM.render(
  <React.StrictMode>
    <ProveedorEstilos theme={tema.base}>
      <ProveedorRedux store={almacen}>
        <App />
      </ProveedorRedux>
    </ProveedorEstilos>
  </React.StrictMode>,
  document.getElementById('inicio')
);