/* Modulos Externos */
import {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
/* Modulos Internos */
import { EVENTOS } from "../utils";
/**
* useSupervisorEventos() - HOOK que asigna eventListeners de forma eficiente a un elemento del DOM.
* @1.- Valida que el elemento DOM soporte "eventListeners".
* @2.- Limpia automáticamente de memoria el supervisor cuando ya no se utiliza.
* @param {string} tipoEvento - string del evento a supervisar (requerido).
* @param {useCallback} callback - método "useCallback" que actualiza el hook (requerido).
* @param {Element} elementoDOM - a ser supervizado | default: window (global). 
* @example const controlador = useCallback( ({ clientX, clientY }) => {
      setCoords({ x: clientX, y: clientY }); // Actualiza coordenadas en el estado. (useState)
    }, [setCoords]);
    useSupervisorEventos('mousemove', controlador); // <-- Usando el hook. */
export default function useSupervisorEventos(tipoEvento, callback, elementoDOM) {
    // Referencia que almacena el controlador
    const controladorAlmacenado = useRef();
    
    // Uso doble efecto actualizador (componentDidUpdate), el primero se activa cuando cambia el controlador y el último cuando el tipoEvento y/o elemento cambian.

    /* Si el controlador cambia, actualiza el valor de "ref.current".
    * Esto permite que éste efecto siempre obtenga el ultimo controlador, sín
    * que se tenga la necesidad de pasarla en el arreglo de deps del efecto
    * y potencialmente cause re-renders en cada ciclo del render.*/
    useEffect(() => {
        controladorAlmacenado.current = callback;
    },[callback]);

    useEffect(() => {
        const esValido = elementoDOM && elementoDOM.addEventListener; // ¿El elemento DOM contiene método addEventListener?
        if(!esValido) {console.info('useSupervisorEventos\n¡elementoDOM es inválido!\nVerificar, imposible insertar eventListener...'); return null;};
        const supervisorEvento = (e) => controladorAlmacenado.current(e); // Función|método supervisor que llama la función controladora almacenada en ref
        elementoDOM.addEventListener(tipoEvento, supervisorEvento); // Agrego supervisor de eventos al elemento
        return () => { elementoDOM.removeEventListener(tipoEvento, supervisorEvento); }; // Remuevo el supervisor de eventos al momento de la limpieza
    }, [tipoEvento, elementoDOM]); // Se vuelve a ejecutar si estas dependencias cambian.
};
// HashTables estáticos
useSupervisorEventos.defaultProps = {
    elementoDOM: window,
};
useSupervisorEventos.propTypes = {
    tipoEvento: PropTypes.oneOf(EVENTOS).isRequired,
    callback: PropTypes.func.isRequired,
    elementoDOM: PropTypes.element,
};