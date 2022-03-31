/* Modulos Externos */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
/* Modulos Internos */
import { selEleccion } from "../redux/stu/stuSlice";
import useAlPulsarTecla from '../hooks/useOnKeyPress';
import { capitalizar, estaVacio, ExhibicionCondicional, getAge } from "../utils";

const Modal = ({abierto, alternar, cbOK, titulo, txtOK, txtCancel}) => {
    useAlPulsarTecla('Escape', abierto ? alternar : ()=>{}, ()=>{});
    let electo = useSelector(selEleccion);
    if(estaVacio(electo)) {
        electo = { gender: 'No-Binario', title: 'ph', firstName: 'Ricky', lastName: 'Ricon', dateOfBirth: '4/12/1972', phone: '(211) 631-2897', picture: 'https://avatars.dicebear.com/api/male/victor.svg' }
    };
    return (
    <>
    <ExhibicionCondicional condicion={abierto}>
    <div 
        className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
        id="modal-id"
    >
        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        <div className="w-full max-w-lg p-3 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
        <div className="">
            <div className="text-center p-5 flex-auto justify-center">
                <p className='h-10 w-40 text-sm align-middle mx-auto mb-2 font-semibold rounded-md bg-pink-600 text-white'>
                    {titulo.toUpperCase()}
                </p>
                <img src={electo.picture} className="mx-auto h-18 w-18 bg-white rounded-full border" alt="..." />
                <h3 className="text-xl font-bold py-4 ">{capitalizar(electo.title)}. {electo.firstName} {electo.lastName}</h3>
                <p className="text-lg text-gray-500 px-8">{capitalizar(electo.gender)} | {getAge(electo.dateOfBirth)} Años</p>
                <p className="text-base text-gray-500 px-8">Teléfono: {electo.phone}</p>
            </div>
            <div className="p-3  mt-2 text-center space-x-4 md:block">
                <button 
                    className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                    onClick={alternar}
                >
                    {txtCancel}
                </button>
                <button
                    className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600"
                    onClick={cbOK}
                >
                    {txtOK}
                </button>
            </div>
        </div>
        </div>
    </div>
    </ExhibicionCondicional>
    <ExhibicionCondicional condicion={!abierto}>
        <></>
    </ExhibicionCondicional>
    </>
  );
};

Modal.propTypes = {
    abierto: PropTypes.bool.isRequired,
    alternar: PropTypes.func.isRequired,
    cbOK: PropTypes.func.isRequired,
    titulo: PropTypes.string,
    txtCancel: PropTypes.string,
    txtOK: PropTypes.string,
};
Modal.defaultProps = {
    titulo: 'Modal',
    txtCancel: 'Cancelar',
    txtOK: 'OK',
}

export default Modal