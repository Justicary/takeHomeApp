/**
* Creo el store con reductores dinámicos.
*/
import { configureStore } from '@reduxjs/toolkit';
import { createInjectorsEnhancer, forceReducerReload } from 'redux-injectors';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from "redux-logger";
import createSagaMiddleware from 'redux-saga';
import crearReductores from './reductores';

export default function configurarAlmacen(preloadedState = {}) {
    const reduxSagaOpcionesMonitoreo = {};
    const reduxLoggerOpciones = {};
    const sagaMiddleware = createSagaMiddleware(reduxSagaOpcionesMonitoreo);
    const logger = createLogger(reduxLoggerOpciones);
    const { run: runSaga } = sagaMiddleware;
    // Crea el store con dos middlewares
    // 1. sagaMiddleware: Hace que redux-sagas funcionen.
    // 2. routerMiddleware: Sincroniza la ruta de ubicación/URL a el state.
    const middlewares = [sagaMiddleware, logger];
    
    const enhancers = [
        createInjectorsEnhancer({
            createReducer: crearReductores,
            runSaga,
        }),
    ];
    const enhancersCompuestos = composeWithDevTools(enhancers)

    const almacen = configureStore({
        reducer: crearReductores(),
        preloadedState: preloadedState,
        // { serializableCheck: false, immutableCheck: false }
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares),
        enhancers: enhancersCompuestos,
        devTools: process.env.NODE_ENV !== 'production',
    });

    // Hago a los reductores "hot reloadable", ver http://mxs.is/googmo   /// && typeof module.hot.accept === 'function'
    /* istanbul ignore next */
    if (module.hot) {
        module.hot.accept('./reductores', () => {
            forceReducerReload(almacen);
        });
    };

    return almacen;
};