import React from 'react';
import PropTypes from 'prop-types';
import { FaTrash } from "react-icons/fa";

const Tabla = ({alBorrar, alClickearImagen, alPresionarBoton, datos, titulo, txtBoton, }) => {
    return (
    <>
    <div className="relative min-w-0 w-11/12 mt-24 self-center break-words shadow-lg rounded bg-pink-900 text-white">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 justify-between">
              <h3 className="font-semibold text-lg text-white">{titulo}</h3>
            </div>
            <button
                className='h-10 w-36 text-sm font-semibold hover:underline rounded-md bg-pink-600 hover:bg-pink-400'
                onClick={alPresionarBoton}
            >
                {txtBoton.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
      <div className="block overflow-x-auto mx-auto w-11/12">
        <table className='items-center w-full bg-transparent border-collapse'>
          <thead>
            <tr>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-pink-800 text-pink-200 border-pink-700">Image</th>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-pink-800 text-pink-200 border-pink-700">Name</th>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-pink-800 text-pink-200 border-pink-700">Email</th>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-pink-800 text-pink-200 border-pink-700">Phone</th>
              {/* <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-pink-800 text-pink-200 border-pink-700">ID</th> */}
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-pink-800 text-pink-200 border-pink-700">Date of Birth</th>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-pink-800 text-pink-200 border-pink-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((el, i)=> {
                let fechaFormateada = new Date(el.dateOfBirth).toLocaleDateString();
                return (
                <tr key={el.id} className='text-white'>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                        <img src={el.picture} className="h-12 w-12 bg-white rounded-full border" alt="..." onClick={() => alClickearImagen(el)} />
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{el.title}. {el.firstName} {el.lastName}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{el.email}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{el.phone}</td>
                    {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{el.id}</td> */}
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{fechaFormateada}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                        <FaTrash size={16} color='red' onClick={() => alBorrar(el)} />
                    </td>
                </tr>
                )
            })}
            
          </tbody>
        </table>
    </div>
    </>
    );
};

Tabla.propTypes = {
    alBorrar: PropTypes.func.isRequired,
    alClickearImagen: PropTypes.func.isRequired,
    alPresionarBoton: PropTypes.func.isRequired,
    datos: PropTypes.array.isRequired,
    titulo: PropTypes.string,
    txtBoton: PropTypes.string,
};
Tabla.defaultProps = {
    titulo: 'Tabla',
    txtBoton: 'Botón',
}
export default Tabla;