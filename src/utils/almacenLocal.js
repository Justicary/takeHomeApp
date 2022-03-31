const sitio = require("./config").sitio;
/* ****************************************************************************************************************
Código/Módulo que se encarga del control interno del LocalStorage & SessionStorage de un dispositivo.
                  ***** OjO Capacidades de Almacenamiento OjO *****
Las "Cookies" están restringidas a 4 Kb. El almacenamiento interno provee mayor capacidad:
Opera 10.50+ permite 5 MB
Safari 8 permite 5 MB
Firefox 34 permite 10 MB (formalmente 5 MB en su origen en 2007)
Google Chrome permite 10 MB en su origen
Internet Explorer permite 10 MB por área de alacenamiento
******************************************************************************************************************* */
;(function(window, define) {
    let _ = { // Constantes, funciones, objetos y letiables de entorno.
        AUTOR: 'VEMG',
        VERSION: '1.7.5',
        areas: {},
        apis: {},
        /**Función que hereda las props de objetoJS a otro.
        * @param {Object} api Objeto fuente.
        * @param {Object} obj Objeto destino.
        * @returns {Objeto} JSON con/sin las propiedades heredadas de api. */
        hereda: function(api={}, obj={}) {
            for (let prop in api) { // Itero objeto api
                if (!obj.hasOwnProperty(prop)) { // Si prop NO existe en obj se le agrega...
                    Object.defineProperty(obj, prop, Object.getOwnPropertyDescriptor(api, prop));
                };
            };
            return obj;
        },
        /**Función que convierte un objetoJS a cadena de texto JSON.
        * @param {Object} objeto JSON a convertir. 
        * @returns {String} JSON.stringify(objeto) */
        stringify: function(objeto) {
            return objeto === undefined || typeof objeto === "function" ? objeto+'' : JSON.stringify(objeto);
        },
        /** Función que convierte una cadena de texto JSON a un objetoJS.
        * @param {String} jsonStr Cadena de texto JSON a convertir.
        * @param {Function} fn Función revividora.
        * @returns {JSON} JSON.parse(jsonStr) JSON*/
        parse: function(jsonStr, fn) {
            try { 
                return JSON.parse(jsonStr, fn || _.revive); 
            } catch(e) {
                console.error('Error: ',e, '\n<<< Se retornó el valor original recibido >>>');
                return jsonStr; // Si no pude "parsearla" regreso el original...
            };
        },
        get: function(area, key) { return area.getItem(key); },
        set: function(area, key, string) { area.setItem(key, string); },
        elimina: function(area, key) { area.removeItem(key); },
        key: function(area, i) { return area.key(i); },
        longitud: function(area) { return area.length; },
        limpiar: function(area) { area.clear(); },
        fn: function(nombre, fn) { // Extensión para hooks
            _.almacenAPI[nombre] = fn;
            for (let api in _.apis) { // Itero _.apis (default: almacenAPI) para que si existe la prop se actualice.
                _.apis[api][nombre] = fn;
            };
        },
        almacenAPI: { // API default | Funciones administrativas
            /**Función que le asigna/crea una nueva API ALMACEN al ID dado.
            * @param {String} id Identificado del área a crear.
            * @param {String} area 
            * @returns _.Almacen con toda su funcionalidad. */
            area: function (id, area) {
                let nuevoAlmacen = this[id];
                if (!nuevoAlmacen || !nuevoAlmacen.area) { // Si el área no existe en el almacen actual...
                    // Se crea una nueva api del area especificada en este namespace
                    nuevoAlmacen = _.Almacen(id, area, this._ns); 
                    // Vuelvo a validar que el ID del área, NO EXISTA en éste contexto para entonces asignarselo.
                    if (!this[id]){ this[id] = nuevoAlmacen; };
                };
                return nuevoAlmacen; // Almacen modificado ó el mismo si ya existía previamente.
            },
            namespace: function (namespace, area) {
                if (!namespace) {
                    return this._ns ? this._ns.substring(0,this._ns.length-1) : '';
                };
                let ns = namespace, almacen = this[ns];
                if (!almacen || !almacen.namespace) {
                    almacen = _.Almacen(this._id, this._area, this._ns+ns+'.'); //nueva api de espacio_de_nombres(namespace)
                    if (!this[ns]){ this[ns] = almacen; }
                    if (!area) { //si NO se especifica el parametro, recorro mis areas...
                        for (let nombre in _.areas) {
                            almacen.area(nombre, _.areas[nombre]);
                        };
                    };
                };
                return almacen;
            },
            esFalso: function() { return this._area.nombre === 'falso'; },
            toString: function() {
                return `localStorage${this._ns ? '.' + this.namespace() : ''}[${this._id}]`;
            },
            // métodos de almacenamiento
            tiene: function(key) {
                if (this._area.tiene) {
                    return this._area.tiene(this._dentroDe(key)); //extension hook
                }
                return !!(this._dentroDe(key) in this._area);
            },
            longitud: function() { return this.keys().length; },
            porCada: function(fn, llenar) { // llenar es usada por la fn keys(llenarLista) & getTodo(llenarLista))
                for (let i=0, m=_.longitud(this._area); i<m; i++) {
                    let key = this._fueraDe(_.key(this._area, i));
                    if (key !== undefined) {
                        if (fn.call(this, key, this.get(key), llenar) === false) {
                            break;
                        }
                    }
                    if (m > _.longitud(this._area)) { m--; i--; }// en caso de remueveElemento
                }
                return llenar || this;
            },
            keys: function(llenarLista) {
                return this.porCada( function(key, valor, lista) { lista.push(key); }, llenarLista || []);
            },
            get: function(key, alt) {
                let string = _.get(this._area, this._dentroDe(key)), fn;
                if (typeof alt === "function") { // si 'alt' es una función...
                    fn = alt;
                    alt = null;
                }
                return string !== null ? _.parse(string, fn) :
                    alt != null ? alt : string;
            },
            getTodo: function (obj_A_Llenar) {
                return this.porCada( function(key, valor, todo) { todo[key] = valor; }, obj_A_Llenar || {});
            },
            transaccion: function(key, fn, alt) {
                let valor = this.get(key, alt),
                    resultado = fn(valor);
                this.set(key, resultado === undefined ? valor : resultado);
                return this;
            },
            set: function(key, datos, sobreescribir) {
                let misDatos = this.get(key);
                // Si existen datos y sobreescribir es FALSE -> NO realizo el cambio.
                if (datos != null && !sobreescribir) return datos;
                return _.set(this._area, this._dentroDe(key), _.stringify(datos), sobreescribir) || datos;
            },
            setTodo: function(datos, sobreescribe) {
                let cambio, valor;
                for (let key in datos) {
                    valor = datos[key];
                    if (this.set(key, valor, sobreescribe) !== valor) {
                        cambio = true;
                    }
                }
                return cambio;
            },
            agrega: function(key, datos) {
                let _datos = this.get(key);
                if (_datos instanceof Array) {
                    datos = _datos.concat(datos);
                } else if (_datos !== null) {
                    let tipo = typeof _datos;
                    if (tipo === typeof datos && tipo === 'object') {
                        for (let key in datos) {
                            _datos[key] = datos[key];
                        }
                        datos = _datos;
                    } else {
                        datos = _datos + datos;
                    }
                };
                _.set(this._area, this._dentroDe(key), _.stringify(datos));
                return datos;
            },
            elimina: function(key, alt) {
                console.info(`${sitio.corto}✔ ${key} Eliminada del AL...`);
                let d = this.get(key, alt);
                _.elimina(this._area, this._dentroDe(key));
                return d;
            },
            limpia: function(nombre='seccion') {
                let area = this._area;
                if (!this._ns) {
                    _.limpiar(this._area);
                } else {
                    this.porCada( function(key) { _.elimina(this._area, this._dentroDe(key)); }, 1);
                }
                console.info(`${sitio.corto}✔ Se limpió ${nombre}...`);
                return this;
            },
            limpiaTodo: function() {
                let area = this._area;
                for (let id in _.areas) {
                    if (_.areas.hasOwnProperty(id)) {
                        this._area = _.areas[id];
                        this.limpia();
                    }
                }
                console.info(`${sitio.corto}✔ AlmacenLocal reiniciado...`);
                this._area = area;
                return this;
            },
  
            // funciones de uso interno
            _dentroDe: function(key) {
                if (typeof key !== "string"){ key = _.stringify(key); }
                return this._ns ? this._ns + key : key;
            },
            _fueraDe: function(key) {
                return this._ns ?
                    key && key.indexOf(this._ns) === 0 ? key.substring(this._ns.length) :
                        undefined // para que porCada() sepa como saltarsela
                    : key;
            },
        }, // fin _.almacenAPI
        
        miLocalStorage_API: {
            contiene: function(key) { return this.elementos.hasOwnProperty(key); },
            /* Funciones que DEBEN coincidir con el API de localStorage */
            clear: function() { for (let key in this.elementos){ this.removeItem(key); } },
            getItem: function(key) { return this.contiene(key) ? this.elementos[key] : null; },
            key: function(i) {
                let c = 0;
                for (let key in this.elementos){
                    if (this.contiene(key) && i === c++) {
                        return key;
                    }
                }
            },
            length: 0,
            removeItem: function(key) {
                if (this.contiene(key)) {
                    delete this.elementos[key];
                    this.length--;
                };
            },
            setItem: function(key, value) {
                if (!this.contiene(key)) this.length++;
                this.elementos[key] = value;
            },
            
        },
        // Método principal para la creación del localStorage personalizado.
        Almacen: function(id, area, namespace) {
            let almacen = _.hereda(_.almacenAPI, 
                function(key, datos, sobreescribe) {
                    // si no se especifican argumentos, regreso TODO el almacen.
                    if (arguments.length === 0){ return almacen.getTodo(); } 
                    if (typeof datos === "function"){ return almacen.transaccion(key, datos, sobreescribe); }
                    if (datos !== undefined){ return almacen.set(key, datos, sobreescribe); }
                    if (typeof key === "string" || typeof key === "number"){ return almacen.get(key); }
                    if (typeof key === "function"){ return almacen.porCada(key); }
                    if (!key){ return almacen.limpia(); }
                    return almacen.setTodo(key, datos);// sobrescribe=datos, datos=key
                }
            );
  
            almacen._id = id;
            almacen._area = area;
            almacen._ns = namespace || '';

            try {
                let llavePrueba = 'testeando_almacen';
                area.setItem(llavePrueba, 'ok');
                area.removeItem(llavePrueba);
            } catch (e) {
                almacen._area = _.almacenar('falso');
            };
  
            
            if (!_.areas[id]) {
                _.areas[id] = almacen._area;
            }
            if (!_.apis[almacen._ns+almacen._id]) {
                _.apis[almacen._ns+almacen._id] = almacen;
            }
            // console.info(`<<< DEBUG almacenLocal -> creó el almacen ${id.toUpperCase()}. >>>`);
            return almacen;
        },
        almacenar: function(nombre) {
            return _.hereda(_.miLocalStorage_API, { elementos: {}, nombre, });
        }
    };
  
    // Inicializo el método con seguridad (genera ERROR en IE10/32bit en el modo para archivos locales)
    let almacenLocal;

    /**Promesa que se utiliza para inicializar el almacenLocal de la aplicación y las diferentes áreas que lo componen.*/
    const inicializar = new Promise((resuelve, rechaza) => {
        try {
            almacenLocal = _.Almacen('local', (() => { try { return localStorage; } catch(e) {console.error(e)} } )(), sitio.prefijo);    
            almacenLocal._ = _; // Propiedad de acceso a constantes,funciones y variables para debugear...
            almacenLocal.area(`metadatos`, _.almacenar(`metadatos`));
            // Inicializo con seguridad al.sesion (genera ERROR en FireFox para los urls con file:///).
            almacenLocal.area(`sesion`, ( () => { try{ return sessionStorage; } catch(e) {console.error(e)} })());
            resuelve(true);
        } catch (error) {
            rechaza('¡OOPS! '+ error);
        };
    });
    inicializar.then((resuelve, error) => {
        if(resuelve) {
            // almacenLocal.limpiaTodo(); // Elimina TODAS las áreas del Almacen Local
            console.info(`${sitio.corto}✔ Implementado ${almacenLocal._.VERSION}:`);
            console.info(`[Namespace]:`, almacenLocal.namespace());
            console.info(`[Áreas]:`, almacenLocal._.areas);
        } else if(error) {
            console.info(`${sitio.corto}❌ AlmacénLocal ¡Error al inicializar!`);
            console.error(error);
        };
    });
  
    // Defino modo "Transportador" en base al ambiente de desarrollo.
    if (typeof define === 'function' && define.amd !== undefined) { // define.js
        console.info(`<<< Almacen Local -> usa ${typeof define} define.js al transportar`);
        define('almacen', [], () => { return almacenLocal; });
    } else if ( typeof exports === 'object' ) { // NodeJS
        console.info(`${sitio.corto}✔ Instancia NODE ${typeof exports}`);
        module.exports = almacenLocal;
    } else { // HTML scripts
        // Si existe la función "al" en el objeto global, la almaceno en "_.conflictos".
        if (window.al){ _.conflictos = window.al; }
        // Transporto en la clase global WINDOW del navegador.
        console.info(`${sitio.corto}✔ Almacén Local -> se asigna a letiable global WINDOW.`);
        window.al = almacenLocal;
    };
})(this, this && this.define); // DUMMY 624400fb348c4cc479a27f1d