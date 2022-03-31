import { createSlice } from '@reduxjs/toolkit';

export const stuSlice = createSlice({
    name: 'stu',
    initialState: {
        catalogo: [],
        descripcion: 'Students State Management',
        eleccion: {},
    },
    reducers: {
        setCatalogo: (state, action) => {
            state.catalogo = [...state.catalogo, action.payload];
        },
        setCatMod: (state, action) => {
            state.catalogo = action.payload;
        },
        setEleccion: (state, action) => {
            state.eleccion = action.payload;
        },
    },
});

/* NOMBRE */
export const { name } = stuSlice.name;

/* ACCIONES
Este método exporta las acciones definidas en el 'slice->reducers' para ser utilizadas individualmente posteriormente.*/
export const {
    setCatalogo,
    setCatMod,
    setEleccion,
} = stuSlice.actions;

/* SELECTORES
Estas funciónes/métodos son selectores y permiten  acceder a un valor especifico de este reductor/estado.
Los selectores también pueden ser definidos "en línea" en el módulo en donde sean necesitados, usando:
'useSelector((state) => state.app.estado)'
Por lo que la declaración de esta función selectora es opcional.*/
export const selCatalogo = (state) => state.stu.catalogo;
export const selEleccion = (state) => state.stu.eleccion;


/* Exporto el reductor de forma default */
export default stuSlice.reducer;