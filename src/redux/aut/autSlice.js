/* AUT SLICE */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { filter, find, isEmpty, omit } from "lodash";
import { coleccion } from "../../utils/config";
import notificacion from '../../componentes/notificacion';
import al from "../../utils/almacenLocal";

// Área de métodos/funciónes asíncronas para leer Firestore...
export const fnAcercaDe = createAsyncThunk('aut/acercaDe', async(args, thunkAPI) => {
    try {
        const {dispatch, getState, requestId} = thunkAPI;
        const {cargando, solicitandoId} = getState().aut;
        let datosPersonalizados = {}, docRef;
        /**
        * Método que crea un objeto personalizado con la información de un snapshot firestore.
        * @param {doc} Snapshot de firestore con la información del empleado. */
        const asignar = (doc) => {
            const {catAreas} = getState().are; // Obtengo el catálogo de areas.
            const {categorias} = getState().cat; // Obtengo el catálogo de categorías.
            const {empleados} = getState().emp; // Obtengo el catálogo de categorías.

            // console.info(`<<<DEBUG >>> fnAcercaDe->asignar()->ENCONTRÉ DATOS PARA ${doc.data().nombre.corto.toUpperCase()} ID[${doc.id}]: `, catAreas);
            // Si EXISTE, personalizo objeto con la información del asociado.
            datosPersonalizados.adsId = doc.data().adsId;
            datosPersonalizados.adscrito = find(catAreas, ['areId', doc.data().adsId ]).descripcion || 'Sín Adscripción...';
            datosPersonalizados.areId = doc.data().areId;
            datosPersonalizados.area = find(catAreas, ['areId', doc.data().areId ]).descripcion || 'Sín Área...';
            datosPersonalizados.biografia = doc.data().biografia;
            datosPersonalizados.catId = doc.data().catId;
            datosPersonalizados.categoria = find(categorias, ['catId', doc.data().catId ]).descripcion || 'Sín Categoría...';
            datosPersonalizados.colaboradores = filter(empleados, ['areId', doc.data().areId ]).filter((ele)=>(ele.empId!==doc.data().empId)); // Filtro primero los colaboradores del área y luego filtro al asociado.
            datosPersonalizados.email = doc.data().email;
            datosPersonalizados.empleadoID = doc.data().empId || '¡NO ID!';
            datosPersonalizados.foto = doc.data().foto;
            datosPersonalizados.frase = doc.data().frase;
            datosPersonalizados.funciones = doc.data().metadatos?.funciones;
            datosPersonalizados.id = doc.id;
            datosPersonalizados.imagen = doc.data().imagen;
            datosPersonalizados.nombre = doc.data().nombre;
            datosPersonalizados.semblanza = doc.data().semblanza;
            datosPersonalizados.telCelular = find(doc.data().telefono, ['tipo', 'Móvil']); // Regresa el primer objeto de una colección que cumpla con el criterio.
            datosPersonalizados.telFijo = find(doc.data().telefono, ['tipo', 'Fijo']); // Regresa el primer objeto de una colección que cumpla con el criterio.
            datosPersonalizados.telefonos = filter(doc.data().telefono, ['activo', true]); // Regresa un arreglo(colección) con los resultados que cumplan el criterio.
            datosPersonalizados.titulo = doc.data().titulo;
        };

        if(!cargando || requestId !== solicitandoId) return; // El código inferior se ejecuta cuando fnAcercaDe.pending se ha ejecutado...

        if(isEmpty(args)) { // Si el método NO tiene argumentos(parámetros)...
            const {asociado} = await getState().aut; // Destructuro mi estado AUT y obtengo el ID del asociado.
            dispatch(setMensaje(`Buscando coincidencias en asociado.id [${asociado.id}], colección ${coleccion.a.toUpperCase()}.`));
            docRef = bd.collection(coleccion.a).doc(asociado.id);
            await docRef.get().then((doc) => {
                if(!doc.exists) {
                    dispatch(setMensaje(`NO EXISTE EL ASOCIADO ID[${asociado.id}]...`));
                    return datosPersonalizados;
                };
                asignar(doc);
            }).catch((error)=>{console.error('fnAcercaDe() | Firestore: ', error)});
            if(isEmpty(datosPersonalizados)) {
                notificacion('warning', 'Atención...', `No se encontró al usuario [${asociado.id}], usando datos predeterminados...`);
                dispatch(setMensaje(`ASIGNANDO ASOCIADO PREDETERMINADO...`));
                docRef = bd.collection(coleccion.a).doc('z5wsWC2zvnitIUFFmHMQ'); // **** <- TODO: El usuario default tiene que ser siempre el director activo...
                await docRef.get().then((doc) => {
                    asignar(doc);
                });
            };
        } else if (args.id) {
            dispatch(setMensaje(`Buscando coincidencias del ID ${args.id} en la colección ${coleccion.a}...`));
            docRef = bd.collection(coleccion.a).doc(args.id);
            await docRef.get().then((doc) => {
                if(!doc.exists) {
                  console.info(`<<< CUIDADO >>> fnAcercaDe()-> * NO EXISTE EL DOCUMENTO ESPECIFICADO CON EL ARGUMENTO ID<${args.id}> EN LA COLECCION ${coleccion.a.toUpperCase()}.`);      
                  return datosPersonalizados; // Regreso objeto en BLANCO.
                };
                asignar(doc);
            }).catch((error) => {
                console.error('fnAcercaDe() | Firestore: ', error);
                notificacion('error', "¡Firestore Error!", `<${error}>`);
            });
        };
        return {args, datos: datosPersonalizados};
    } catch (error) {
        return thunkAPI.rejectWithValue({ error });
    };
});
export const buscarAsociadosPor = createAsyncThunk('aut/buscarAsociadosPor', async (args, thunkAPI) => {
        try {
            const {dispatch, getState} = thunkAPI;
            let metadatos = {}, qryEmpleados;
            const validar = (query, tipo='', valor='') => {
                if(query.empty) {
                    console.info(`<<<DEBUG >>> buscarAsociadosPor->validar->NO ENCONTRÉ METADATOS PARA EL ${tipo.toUpperCase()}: `, valor);
                    return metadatos;
                };
                if(query.size > 1) { // Si hay mas de un empleado con el mismo email lo notifico...
                    notificacion('warning', "¡Cuidado!", `Encontré más de un registro de información del ${tipo} <${valor}>, regresando la última coincidencia...`);
                    // console.info(`<<<DEBUG >>> buscarAsociadosPor->validar->PRECAUCIÓN - REGRESO LA PRIMERA COINCIDENCIA, YA QUE ENCONTRÉ ${query.size} EMPLEADOS CON EL MISMO ${tipo.toUpperCase()}: `, query.docs);    
                } else {
                    notificacion('info', "¡Atención!", `Procesando información del ${tipo}<${valor}>...`);
                    // console.info(`<<<DEBUG >>> buscarAsociadosPor->validar->ÉXITO - ENCONTRÉ METADATOS PARA EL ${tipo.toUpperCase()} <${valor.toUpperCase()}> EN: `, query.docs[0]);
                };
                query.forEach((doc) => {
                    metadatos = doc.data();
                    metadatos.id = doc.id;
                });
                return metadatos;
            };
            if(isEmpty(args) || args.email) { // Si el método NO tiene argumentos(parámetros) ó el argumento es EMAIL...
                let email = getSesionEmail(); // Obtengo el EMAIL directamente de mi objeto Firebase-Auth.
                if(email) { // Si tenemos un email registrado en AUTH->sesión...
                    dispatch(setMensaje(`Buscando coincidencias del correo ${email} en la colección ${coleccion.a}...`));
                    qryEmpleados = await bd.collection(coleccion.a).where('metadatos.activo', '==', true).where('email', 'array-contains', {correo: email, etiqueta: 'Trabajo'}).get().catch((error)=>{console.error('buscarAsociadosPor->(Email) | Firestore: ', error)});
                    validar(qryEmpleados, 'email', email);
                } else {
                    console.info('<<<DEBUG >>> buscarAsociadosPor->¡AVISO! NO HAY SESION, POR LO QUE NO PUEDO OBTENER LOS METADATOS DE FIRESTORE...');
                    return metadatos;
                };
            } else if (args.nombre) {
                dispatch(setMensaje(`Buscando coincidencias con el nombre ${args.nombre} en la colección ${coleccion.a}...`));
                qryEmpleados = await bd.collection(coleccion.a).where('metadatos.activo', '==', true).where('nombre.completo', '>=', args.nombre).get().catch((error)=>{console.error('buscarAsociadosPor->(Nombre) | Firestore: ', error)});
                validar(qryEmpleados, 'nombre', args.nombre);
            } else if (args.id) {
                dispatch(setMensaje(`Buscando coincidencias del ID ${args.id} en la colección ${coleccion.a}...`));
                qryEmpleados = await bd.collection(coleccion.a).doc(args.id).get().catch((error)=>{console.error('buscarAsociadosPor->(Nombre) | Firestore: ', error)});
                validar(qryEmpleados, 'ID', args.id);
            };
            return {args, metadatos};
        } catch (error) {
            return thunkAPI.rejectWithValue({ error });
        };
    },{}
);

export const autSlice = createSlice({
    name: 'aut',
    initialState: {
        acercade: {},
        asociado: {},
        autenticado: false,
        error: false,
        mensaje: '',
        sesion: {},
        solicitandoId: undefined,
    },
    reducers: {
        desconectar(state) {
            notificacion('warning', 'Aviso', `Se ha cerrado la sesión, redireccionando a la pantalla de inicio...`);
            al.sesion.elimina('firebase');
            state.autenticado = false;
            state.sesion = {};
            desconectarse();
        },
        setAsociado(state, action) {
            const {id} = action.payload;
            state.error = false;
            state.asociado = {
                id,
                ...state.asociado
            };
        },
        setAutenticado(state, action) {
            state.autenticado = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setMensaje(state, action) {
            state.mensaje = action.payload;
        },
        setSesion: (state, action) => {
            const {datos, mensaje} = action.payload;
            state.sesion = datos;
            state.mensaje = mensaje;
        },
    },
    extraReducers: {
        [buscarAsociadosPor.pending]: (state) => {
            state.cargando = !state.cargando && true;
            state.error = false;
            state.mensaje = 'Buscando coincidencias en el catálogo de empleados...';
        },
        [buscarAsociadosPor.fulfilled]: (state, action) => {            
            const { args, metadatos } = action.payload;
            if(!isEmpty(metadatos)) {

                let _usuario = getSesionUsuario();
                let _sesion = {
                    displayName: _usuario.displayName,
                    email: _usuario.email,
                    extras: omit(metadatos, ['catRef']),
                    metadata: _usuario.metadata,
                    phoneNumber: _usuario.phoneNumber,
                    photoURL: _usuario.photoURL,
                    refreshToken: _usuario.refreshToken,
                    uid: _usuario.uid,
                    verificado: _usuario.emailVerified,
                };
                state.autenticado = true;
                state.mensaje = `Sesión establecida exitosamente en autorizacionSlice[buscarAsociadosPor.fulfilled]...`;
                state.sesion = _sesion;
                // Agrego a LocalSession la autenticación...
                al.sesion.agrega('firebase', _sesion);
                notificacion('success', `Bienvenid@ ${_sesion.extras.nombre.corto}`, `Autenticación exitosa, accesando al "dashboard" de la CEASPUE...`);
            } else {
                state.mensaje = `OjO: No encontré los metadatos del empleado, por lo que se elimina y desconecta la sesión....`;
                eliminar().then(() =>{notificacion('error', '¡Aviso!', 'Correo electrónico INVALIDO, no tienes acceso al sistema de control...');});
            };
            state.cargando = state.cargando && false;
        },
        [buscarAsociadosPor.rejected]: (state, action) => {
            state.mensaje = 'ERROR al buscar en el catálogo de empleados, ver error...';
            state.error = action.payload;
            state.cargando = state.cargando && false;
        },
        [fnAcercaDe.pending]: (state, action) => {
            if(!state.cargando) {
                state.cargando = !state.cargando && true;
                state.error = !!state.error && false;
                state.mensaje = 'Obteniendo información del catálogo de empleados...';
                state.solicitandoId = action.meta.requestId;
            }
        },
        [fnAcercaDe.rejected]: (state, action) => {
            const { requestId } = action.meta;
            if( state.cargando && state.solicitandoId === requestId) {
                state.mensaje = 'ERROR al obtener asociado del catálogo de empleados, vease error...';
                state.error = action.error;
                state.cargando = state.cargando && false;
                state.solicitandoId = undefined;
            }
        },
        [fnAcercaDe.fulfilled]: (state, action) => {
            const { args, datos } = action.payload;
            if(!isEmpty(datos) && state.cargando && state.solicitandoId === action.meta.requestId) {
                // notificacion('info', 'En instantes...', `...estará lista la información de ${datos.nombre.corto}.`);
                state.mensaje = isEmpty(args) ? `La información de ${datos.nombre.corto} fué establecida exitosamente...` : `La información de ${datos.nombre.corto}(ID) fué establecida exitosamente...`;
                state.acercade = datos;
                state.solicitandoId = undefined;
                // Agrego datos del usuario a LocalStorage...
                al.agrega('usuario', datos);
                // console.info(`<<< DEBUG >>> fnAcercaDe.fulfilled-> * USUARIO ASIGNADO CON ÉXITO AL ALMACEN.`);
            };
            state.cargando = state.cargando && false;
        }
    },
});

/* NOMBRE */
export const { name } = autSlice.name;

/* ACCIONES
Este método exporta las acciones definidas en el 'slice->reducers' para ser utilizadas posteriormente.*/
export const {
    desconectar,
    setAsociado,
    setAutenticado,
    setError,
    setMensaje,
    setSesion,
} = autSlice.actions;

/* SELECTORES / GETTERS
Estas funciónes/métodos son selectores(getters) y permiten  acceder a un valor especifico de este reductor/estado.
Los selectores también pueden ser definidos "en línea" en el módulo en donde sean necesitados, usando:
'useSelector((state) => state.contador.valor)'
Por lo que la declaración de esta función selectora es opcional.*/
export const getAcercaDe = state => state.aut.acercade;
export const getAsociado = state => state.aut.asociado;
export const getAutenticado = state => state.aut.autenticado;
export const getSesion = state => state.aut.sesion;

/* Exporto el reductor de forma default */
export default autSlice.reducer;