import {DUMMY_LIMIT, DUMMY_PAGE} from './constantes';
/* EXPRESIONES REGULARES
============================= */
const hexCaracteres = 'a-f\\d';
const hexDe3o4 = `#?[${hexCaracteres}]{3}[${hexCaracteres}]?`;
const hexDe6a8 = `#?[${hexCaracteres}]{6}([${hexCaracteres}]{2})?`;
const noHexChars = new RegExp(`[^#${hexCaracteres}]`, 'gi');
const hexValido = new RegExp(`^${hexDe3o4}$|^${hexDe6a8}$`, 'i');

/**
 * Componente JSX que exhibe los componentes que envuelve si la condición es verdadera.
 * @prop {condicion} Expresión lógica a evaluar para ejecutar el código envuelto.
 * @prop {children} Componente(s) a mostrar si la condición se cumple. 
 * @example <ExhibiciónCondicional condicion={estaVacio(datos)}>
 * <Componente />
 * <ExhibiciónCondicional/>*/
 export const ExhibicionCondicional = ({condicion, children}) => condicion ? children : null;

/**
* Metodo para capitalizar un texto. Es decir cambia el primer caracter del mismo a mayúsculas.
* @example let nombre = capitalizar('andrés); // Andrés */
export const capitalizar = (str = '') => str ? str.charAt(0).toUpperCase() + str.slice(1) : false;

/**
* @param {String} URL del sitio https://coolors.co/ con una paleta de colores.
* @param {String} transparencia String con el porcentaje. Ejemplo "75%".
* @returns Arreglo con colores hexadecimales, si se especifica transparencia, se la agrega. */
export const coolorsToHex = (URL, transparencia=undefined) => {
  // if (!urlValido.test(URL)) throw new TypeError('¡NO ES UN URL VÁLIDO!...');
  if(transparencia) {
    return URL.replace(/^.+\/([^/]+)$/, '$1').split('-').map(hex => `#${hex}${transparencia.replace(/(%)/, '')}`); 
  }
  return URL.replace(/^.+\/([^/]+)$/, '$1').split('-').map(hex => `#${hex}`);
};

/**
* Método que convierte colores HEX en RGB
* @param {String} hex Color HEX de 3 a 8 posiciones.
* @param {Object} opciones JSON-> alfa: {Number}, formato: {String} 'array' | 'css'
* @returns {String} JSON {red, green, blue, alpha} ó ARRAY [red, green, blue, alpha] ó CSS 'rgb(188,214,222, 0.75)' */
export const hex2rgb = (hex, opciones = {}) => {
	if (typeof hex !== 'string' || noHexChars.test(hex) || !hexValido.test(hex)) throw new TypeError('No es un string válido hexadecimal.');

	let valorAlfa = 1; // ALPHA default, si el color HEX no especifica.
	
    hex = hex.replace(/^#/, ''); // Si el string contiene un '#' lo elimino. Asumiendo longitud de 6.
    // Validación y preparación del HEX.
	
	if (hex.length === 8) {
		//valorAlfa = Number.parseInt(hex.slice(6, 8), 16) / 255;
		valorAlfa = (Number.parseInt(hex.slice(6, 8), 26) / 255).toFixed(2);
		hex = hex.slice(0, 6);
		// console.info(`☣ <<DEBUG>> LARGO(${hex.length}):`, valorAlfa, 'H:', hex);
	} else if (hex.length === 4) {
		valorAlfa = Number.parseInt(hex.slice(3, 4).repeat(2), 16) / 255; // Tomo el último valor como ALPHA, lo repito y lo calculo.
		hex = hex.slice(0, 3); // Convierto el HEX a 3 posiciones.
	}; 
    if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]; // Convierto los HEX de 3 a 6 posiciones.
	};
    // Lógica
	const numero = Number.parseInt(hex, 16);
	const red = numero >> 16;
	const green = (numero >> 8) & 255;
	const blue = numero & 255;
	const alpha = typeof opciones.alfa === 'number' ? opciones.alfa : valorAlfa;
    // Opciones de retorno...
	if (opciones.formato === 'array') {
		return [red, green, blue, alpha];
	};
	if (opciones.formato === 'css') {
		// const alphaString = alpha === 1 ? '' : `${Number((alpha * 100).toFixed(2))}%`;
		return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
	};
	return {red, green, blue, alpha}; // Retorno default
};

/**
* Invierte los valores de la paleta primaria y secundaria de colores de un tema.
* @param paleta Objeto de strings hexadecimales que representan una paleta de colores.
* @example
* invertirPaleta({ primaria: ['rojo', 'amarillo', 'verde'] });
* devuelve: { primaria: ['verde', 'amarillo', 'rojo'] } */
export const invertirPaleta = (paleta={}) => {
  try {
    if(!estaVacio(paleta)) {
      return Object.keys(paleta).reduce((nuevaPaleta, key) => ({
        ...nuevaPaleta, 
        [key]: [...paleta[key]].reverse()
      }), {});
    } else {
      return [];
    }
  } catch (error) {
    console.error('utilidades->invertirPaleta ', error);
  };
};

/**
* Método que devuelve un número entero o decimal aleatorio en base a los parámetros especificados.
* Si no se especifican éstos parámetros se utiliza por default min=1, max=10 y decimal=false.
* @param {Number} min Número mínimo, default 0.
* @param {Number} max Número máximo, default 10.
* @param {Boolean} decimal Activa o desactiva el resultado decimal.
* @returns Un numero entero o decimal.  */
export const getAleatorio = (min=0, max=10, decimal=false) => {
  try {
    if(decimal) {
      return (Math.random() * (max - min + 1) + min).toFixed(2);
    } else {
      return (Math.floor(Math.random() * (max - min + 1)) + min);
    };
  } catch (error) {
    console.error('utilidades->getAleatorio() ', error);
  };
};

/**
 * Método que evalúa el objeto dado y determina su tipo.
 * @param objeto Cualquier tipo de variable o estructura de datos.
 * @returns {type} "array" | "number" | "object" | "string" */
 export const getTipo = (objeto) => {
  return {}.toString
    .call(objeto)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase(); // Encadenamiento
};

/**
 * Método que determina si el tipo de objeto de datos dado, es un objeto o un arreglo.
 * @param evaluandoEs Objeto de datos a ser evaluado.
 * @returns {bolean} true ó false */
export const objetoOarreglo = (evaluandoEs) => {
  return evaluandoEs instanceof Object || getTipo(evaluandoEs) === "array"
};

/**
* Método que extiende y sobreescribe los key-values del objeto fuente en el objeto destino.
* @param {Object} destino Objeto que recibe los key->value del fuente.
* @param {Object} fuente Objeto a combinar con el destino.
* @returns {Object} JSON ó "undefined" cuando el destino *NO* es un objeto.*/
export const extender = (destino, fuente) => {
  if (!destino instanceof Object) return undefined;
  if (!fuente instanceof Object) return destino;
  for( var key in fuente ) { 
		if( fuente.hasOwnProperty( key ) ) {
			destino[key] = fuente[key];
		};
	};
  return destino;
};

/**
* Método que fusiona (sobreescribe) los "keys" del objeto fuente en el objeto destino.
* @param {Object} destino 
* @param {Object} fuente 
* @returns {Object} Objeto destino fusionado con las KEYS del fuente. */
export const fusionar = (destino, fuente) => {
	for( var key in fuente ) { 
		if( fuente.hasOwnProperty( key ) ) {
			destino[key] = fuente[key];
		}
	}
	return destino;
};

/**
* Método que hace esperar la ejecución del código X milisegundos.
* @param {Number} ms Milisegundos a esperar.
* @returns Promesa para encadenar el método. */
export const espera = async (ms) => new Promise(res => setTimeout(res, ms));

/**
* estaVacio() - Determina si un objeto esta vacío.
* @param {objeto} objeto - Objecto a ser evaluado.
* @returns {boleano} Retorna true o false. */
export function estaVacio(objeto) {
    for(let key in objeto) { 
      if(objeto.hasOwnProperty(key)) return false; 
    };
    return true;
};

/** Metodo que realiza llamada a un API de forma asíncrona.
* @param {String} url API fuente.
* @param {Object} init JSON con la información adicional de configuración.
* @returns {Object} JSON con los datos obtenidos ó false si se presentó un error.*/
export async function fetchAsync(url, init={}, dummy=true) {
  let fetchAgain = false;
  let datos = null;
  const _url = creaURL(url);
  /* Opciones exclusivas para dummy API */
  if(dummy) {
    _url.searchParams.set('limit', DUMMY_LIMIT);
    _url.searchParams.set('page', DUMMY_PAGE);
  };
  const respuesta = estaVacio(init) ? await fetch(_url) : await fetch(_url, init);
  if(respuesta.ok) {
    const response = await respuesta.json(); // Obtengo los datos como JSON.
    if(dummy) {
      datos = response.data.map((e)=>e.id);
    } else {
      datos = response;
    };
    fetchAgain = true;
  } else {
    console.error(`Estátus: ${respuesta.status}\nTexto: ${respuesta.statusText}`);
    return false;
  };
  return datos;
};

function creaURL(url) {
  const _url = new URL(url);
  return _url;
};

export const getAge = (dateString) => {
  let today = new Date();
  var bd = new Date(dateString);
  var age = today.getFullYear() - bd.getFullYear();
  let month = today.getMonth() - bd.getMonth();
  if(month < 0 || (month === 0 && today.getDate() < bd.getDate())) {
    age--;
  }
  return age;
}