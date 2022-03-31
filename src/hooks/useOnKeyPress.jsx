/* Modulos Externos */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
/**
* useAlPulsarTecla() - Hook que monitorea cuando se presiona una tecla especifica.
* @param {string} tecla - a monitorear (requerida).
* @param {callback} alPulsar - Función/callback que se ejecuta al pulsar la tecla.(opcional)
* @param {callback} alSoltar - Función/callback que se ejecuta al soltar la tecla.(opcional)
* @returns true ó false
* @example const pulsandoEnter = useAlPulsarTecla('Enter');*/
export default function useAlPulsarTecla(tecla, alPulsar, alSoltar) {
    const [teclaSupervisada, setTeclaSupervisada] = useState(false); // Estado para dar seguimiento de cuando la tecla es presionada
    let teclaPrevia = ''; // Variable que almacena la tecla previamente presionada para envitar re-rendereo
    // Si la tecla que se presiona es la tecla objetivo, se establece TRUE
    function teclaPresionada({ key }) { // Destructuro event (vanilla function)
        // console.warn('DEBUG - Tecla presionada:', key);
        if (key === teclaPrevia) return; // Evitar múltiple rendereo, si por accidente o intencionalmente el usuario deja presionada la tecla.
        if (key === tecla) { 
            setTeclaSupervisada(true);
            teclaPrevia = key;
            alPulsar && alPulsar();
        };
    };
    const teclaLiberada = ({ key }) => { // Destructuro event (arrow function)
        if (key === tecla) { // Si la tecla que se libera es la tecla objetivo, se establece FALSE
            setTeclaSupervisada(false);
            teclaPrevia = '';
            alSoltar && alSoltar();
        };
    };
    useEffect(() => { // Establezco supervisores de eventos
        // Se asignan los supervisores en la fase de montado (componentDidMount)
        window.addEventListener('keydown', teclaPresionada);
        window.addEventListener('keyup', teclaLiberada);
        // Removemos los supervisores en la fase de limpieza (componentWillMount & componentWillDismount)
        return () => { // Efecto que se ejecuta al principio y al final.
            window.removeEventListener('keydown', teclaPresionada);
            window.removeEventListener('keyup', teclaLiberada);
        };
    }, []); // Empty "Deps" asegura que el efecto solo se ejecute al montar el hook. (CDM)
    return teclaSupervisada;
};
// HashTables estáticos
useAlPulsarTecla.defaultProps = {
    alPulsar: null,
    alSoltar: null,
};
useAlPulsarTecla.propTypes = {
    tecla: PropTypes.string.isRequired,
    alPulsar: PropTypes.func,
    alSoltar: PropTypes.func,
};