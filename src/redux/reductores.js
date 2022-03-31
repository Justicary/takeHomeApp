/**
* Combina todos los reductores(slices) en este archivo y los exporta como reductores combinados.
*/
import { combineReducers } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
// import autSlice from './aut/autSlice';
import stuSlice from './stu/stuSlice';

/**
 * Combina el reductor principal con el estado del router y los demás reductores inyectados dinámicamente.*/
export default function crearReductores(reductoresInyectados = {}) {
  const reductorRaiz = combineReducers({
    ...reductoresInyectados,
    app: appSlice,
    stu: stuSlice,
  });
  return reductorRaiz;
};