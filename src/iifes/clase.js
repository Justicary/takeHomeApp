/* ****************************************************************************************************************
                               << Funciónes que se invocan inmediatamente (IIFE) >>
                                      Immediately Invoked Function Expression
                  *** Función que agrega funcionalidad extra a la variable global "window" del DOM. ***
******************************************************************************************************************* */
import {sitio} from '../utils/config';
(function(window) {
    
    function clase2ExpReg( className ) {
      return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    };
    
    // Administrador de clases para el elemento classList del nodo
    // ToDo: Implementar múltiples clases.
    var contieneClase, agregaClase, eliminaClase;
    
    if ('classList' in document.documentElement) {
      contieneClase = function(nodo, elemento) {
        return nodo.classList.contains(elemento);
      };
      agregaClase = function( nodo, elemento ) {
        nodo.classList.add( elemento );
      };
      eliminaClase = function( nodo, elemento ) {
        nodo.classList.remove( elemento );
      };
    } else {
      contieneClase = function( nodo, elemento ) {
        return clase2ExpReg( elemento ).test( nodo.className );
      };
      agregaClase = function( nodo, elemento ) {
        if ( !contieneClase( nodo, elemento ) ) {
          nodo.className = nodo.className + ' ' + elemento;
        };
      };
      eliminaClase = function( nodo, elemento ) {
        nodo.className = nodo.className.replace( clase2ExpReg( elemento ), ' ' );
      };
    };

    /**
    * Función que agrega/remueve(alterna) una clase de un nodo DOM específico.
    * @param {React.Ref} nodo Referencia a un elemento DOM, inicializada con el hook UseRef.
    * @param {String} elemento Nombre de la clase a buscar dentro de la propiedad "classList" del DOM. */
    function alternaClase( nodo, elemento ) {
        var evalua = contieneClase( nodo, elemento ) ? eliminaClase : agregaClase;
        evalua( nodo, elemento );
    };

    var clase = { // Hash table
        // Completos
        contieneClase: contieneClase,
        agregaClase: agregaClase,
        eliminaClase: eliminaClase,
        alternaClase: alternaClase,
        // ó Abreviados
        contiene: contieneClase,
        agrega: agregaClase,
        elimina: eliminaClase,
        alterna: alternaClase
    };
    // Transportador
    if ( typeof exports === 'object' ) {
        // CommonJS
        console.info(`${sitio.corto}IIFE clase exportado. `);
        module.exports = clase;
    } else {
        // Asignación a clase global del navegador
        console.info(`${sitio.corto}✔ IIFE asignado...`);
        window.clase = clase;
    };
})(window);