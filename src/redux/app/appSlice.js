import { createSlice } from '@reduxjs/toolkit';

/**
* Método que determina dinámicamente la vista actual del dispositivo.
* @param {Number} ancho Número que representa el ancho interno del dispositivo.
* @returns {String} Regresa el dispositivo en el que se ejecuta la App. */
export const getVistaActual = (ancho) => {
    let vistaActual = 'Móvil';
    if(ancho > 1280) {
        vistaActual = 'Escritorio';
    } else if(ancho > 992) {
        vistaActual = 'Laptop'
    } else if(ancho > 767) {
        vistaActual = 'Tableta'
    } else if(ancho > 480) {
        vistaActual = 'Apaisado'
    };
    return vistaActual;
};

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        banderas: { actualizar: false, animando: false, cargando: false, colapsar: false, intro: true, modal: false, mostrar: false, nuevo: true, oscuro: true, qrEscaner: false, visualizar: false },
        enLinea: false,
        locale: { idioma: navigator.language.split(/[-_]/)[0], pais: navigator.language.split(/[-_]/)[1], },
        mensaje: '',
        metadatos: { seleccion: {}, favoritos: [] },
        ventana: { ancho: window.innerWidth, alto: window.innerHeight },
        version: 'v0322-001',
        vista: getVistaActual(window.innerWidth)
    },
    reducers: {
        alternaActualizar: (state) => {state.banderas.actualizar = !state.banderas.actualizar},
        alternaEscaner: (state) => {state.banderas.qrEscaner = !state.banderas.qrEscaner}, 
        alternaModal: (state) => {state.banderas.modal = !state.banderas.modal}, 
        alternaNuevo: (state) => {state.banderas.nuevo = !state.banderas.nuevo},
        alternaVisualizar: (state) => {state.banderas.visualizar = !state.banderas.visualizar}, 
        setAnimando: (state, action) => {
            state.banderas.animando = action.payload;
        },
        setCargando: (state, action) => {
            const {valor, mensaje} = action.payload;
            state.banderas.cargando = valor;
            state.mensaje = mensaje;
        },
        setEnLinea: (state, action) => {
            state.enLinea = action.payload;
        },
        setFavoritos: (state, action) => {
            const {valor, mensaje} = action.payload;
            state.mensaje = mensaje;
            state.metadatos.favoritos = valor;
        },
        setIdioma: (state, action) => {
            state.locale.idioma = action.payload;
        },
        setIntro: (state, action) => {
            const {valor, mensaje} = action.payload;
            state.banderas.intro = valor;
            state.mensaje = mensaje;
        },
        setMostrar: (state, action) => {
            state.banderas.mostrar = action.payload;
        },
        setPais: (state, action) => {
            state.locale.pais = action.payload;
        },
        setSeleccion: (state, action) => {
            state.metadatos.seleccion = action.payload;
        },
        setOscuro: (state, action) => {
            state.banderas.oscuro = action.payload;
        },
        setVentana: (state, action) => {
            const {ancho, alto} = action.payload; // Destructuro los datos contenidos en payload.
            state.banderas.colapsar = ancho > 1025 ? false : true;
            state.ventana = {ancho, alto};
            state.vista = getVistaActual(ancho);
        },
        setVersion: (state, action) => {
            state.version = action.payload;
        },
        setVisualizar: (state, action) => {
            state.banderas.visualizar = action.payload;
        },
    },
});

/* NOMBRE */
export const { name } = appSlice.name;

/* ACCIONES
Este método exporta las acciones definidas en el 'slice->reducers' para ser utilizadas individualmente posteriormente.*/
export const {
    alternaActualizar,
    alternaEscaner,
    alternaModal,
    alternaNuevo,
    alternaVisualizar,
    setAnimando,
    setCargando,
    setEnLinea,
    setFavoritos,
    setMostrar,
    setIdioma,
    setIntro,
    setPais,
    setSeleccion,
    setOscuro,
    setVentana,
    setVersion,
    setVisualizar
} = appSlice.actions;

/* SELECTORES
Estas funciónes/métodos son selectores y permiten  acceder a un valor especifico de este reductor/estado.
Los selectores también pueden ser definidos "en línea" en el módulo en donde sean necesitados, usando:
'useSelector((state) => state.app.estado)'
Por lo que la declaración de esta función selectora es opcional.*/
export const selAbrir = (state) => state.app.barra.abrir;
export const selActualizar = (state) => state.app.banderas.actualizar;
export const selAnimando = (state) => state.app.banderas.animando;
export const selCargando = (state) => state.app.banderas.cargando;
export const selColapsada = (state) => state.app.barra.colapsada;
export const selEnLinea = (state) => state.app.enLinea;
export const selCupon = (state) => state.app.banderas.cupon;
export const selConfig = (state) => state.app.config;
export const selFavoritos = (state) => state.app.metadatos.favoritos;
export const selIdioma = (state) => state.app.locale.idioma;
export const selIntro = (state) => state.app.banderas.intro;
export const selInyectando = (state) => state.app.banderas.inyectando;
export const selMetadatos = (state) => state.app.metadatos;
export const selModal = (state) => state.app.banderas.modal;
export const selMostrar = (state) => state.app.banderas.mostrar;
export const selPais = (state) => state.app.locale.pais;
export const selPosicion = (state) => state.app.barra.posicion;
export const selRutaAbierta = (state) => state.app.ruta.abierta;
export const selRutaActual = (state) => state.app.ruta.actual;
export const selSeleccion = (state) => state.app.metadatos.seleccion;
export const selNuevo = (state) => state.app.banderas.nuevo;
export const selOscuro = (state) => state.app.banderas.oscuro;
export const selUbicacion = (state) => state.app.config.ubicacion;
export const selVersion = (state) => state.app.version;
export const selVentana = (state) => state.app.ventana;
export const selVisibilidad = (state) => state.app.barra.visibilidad;
export const selVisualizar = (state) => state.app.banderas.visualizar;
export const selVista = (state) => state.app.vista;

/* Exporto el reductor de forma default */
export default appSlice.reducer;