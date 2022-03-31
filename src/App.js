/* Modulos Externos */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { filter } from 'lodash';
/* Modulos Internos */
import { selCargando, setCargando, selOscuro, selSeleccion, setSeleccion, selVentana } from "./redux/app/appSlice";
import { selCatalogo, setCatalogo, setCatMod, selEleccion, setEleccion } from "./redux/stu/stuSlice";
import { DUMMYAPI_URL, estaVacio, espera, ExhibicionCondicional, fetchAsync, sitio } from "./utils";
import useSupervisorEventos from './hooks/useEventListener';
import Tabla from './components/tabla';
import Modal from './components/modal';
import Estilo from './App.estilo';

const  App = () => {
  const catStudents = useSelector(selCatalogo);
  const despachar = useDispatch();
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('add new student');
  const refApp = useRef(null);
  const seleccion = useSelector(selSeleccion);
  const ventana = useSelector(selVentana);
  const { clase } = window;
  useEffect(() => {
    let mainDOM = refApp.current.querySelector('.mainContent');
    let dummyInit = { headers: {"app-id": process.env.REACT_APP_DUMMYAPI_KEY}, }
    if(catStudents.length) {
      console.log('Ya tenemos catalogo en redux...');
    } else {
      fetchAsync(DUMMYAPI_URL, dummyInit).then((IDs) => {
        IDs.forEach((id) => {
          fetchAsync(`${DUMMYAPI_URL}/${id}`, dummyInit, false).then((student) => {
            despachar(setCatalogo(student));
            // console.info('Objeto: ', objeto);
            // console.info('Identico a student: ', student === objeto);
          });
        });  
      });
      console.info('Termine de obtener TODO el catálogo del estudiantes.');
    };
    clase.contiene(mainDOM, 'cargando') && clase.elimina(mainDOM, 'cargando');
  },[]);
  useEffect(() => {console.info('Estado modal: ', modal)}, [modal]);
  const DUMMYAPI_KEY = process.env.REACT_APP_DUMMYAPI_KEY;
  const alternarModal = () => {
    modal ? setModal(false) : setModal(true);
  };
  const alGuardar = () => {
    console.info('Guardaste los datos...');
    alternarModal();
  };
  const clickImage = (el) => {
    despachar(setEleccion(el));
    setModalTitle('review student');
    alternarModal();
  };
  const alBorrar = (el) => {
    despachar(setCatMod(filter(catStudents, (s) => s.id!==el.id)));
  };
  return (
  <Estilo className="flex flex-col flex-auto flex-shrink-0 w-full h-screen antialiased oh" ref={refApp}>
    {/* ================================
            BARRA DE NAVEGACIÓN
    ===================================*/}
    <nav className="flex justify-around py-4 bg-pink-100/80 backdrop-blur-md shadow-md w-full fixed top-0 left-0 right-0 z-10">
      {/* Logo */}
      <div className="flex items-center">
          <a className="cursor-pointer">
              <h3 className="text-2xl font-medium text-blue-500">
                  <img className="h-10 object-cover" src="https://stackoverflow.design/assets/img/logos/so/logo-stackoverflow.svg" alt="Logo"/>
              </h3>
          </a>
      </div>
      {/* Sección Ligas */}
      <div className="items-center hidden space-x-8 lg:flex">
          <a className="flex text-blue-700 hover:text-blue-400 cursor-pointer transition-colors duration-300">
              Inicio
          </a>
      </div>
      {/* Sección Menú con Iconos */}
      <div className="flex items-center space-x-5">
        <a className="flex text-gray-600 hover:text-blue-500 cursor-pointer transition-colors duration-300">
          <svg className="fill-current h-5 w-5 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 0L11.34 .03L15.15 3.84L16.5 2.5C19.75 4.07 22.09 7.24 22.45 11H23.95C23.44 4.84 18.29 0 12 0M12 4C10.07 4 8.5 5.57 8.5 7.5C8.5 9.43 10.07 11 12 11C13.93 11 15.5 9.43 15.5 7.5C15.5 5.57 13.93 4 12 4M12 6C12.83 6 13.5 6.67 13.5 7.5C13.5 8.33 12.83 9 12 9C11.17 9 10.5 8.33 10.5 7.5C10.5 6.67 11.17 6 12 6M.05 13C.56 19.16 5.71 24 12 24L12.66 23.97L8.85 20.16L7.5 21.5C4.25 19.94 1.91 16.76 1.55 13H.05M12 13C8.13 13 5 14.57 5 16.5V18H19V16.5C19 14.57 15.87 13 12 13M12 15C14.11 15 15.61 15.53 16.39 16H7.61C8.39 15.53 9.89 15 12 15Z" />
          </svg>
          Registro
        </a>

        <a className="flex text-gray-600 cursor-pointer transition-colors duration-300 font-semibold hover:text-blue-500">
            <svg className="fill-current h-5 w-5 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
                <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
            </svg>
            Ingresar
        </a>
      </div>
    </nav>
    {/* ================================
            CONTENIDO PRINCIPAL
    ===================================*/}
    <div className='mainContent cargando h-full flex flex-col'>      
      <Tabla datos={catStudents} titulo='Students List' txtBoton='add new student' alBorrar={alBorrar} alPresionarBoton={alternarModal} alClickearImagen={clickImage} />
      <Modal abierto={modal} alternar={alternarModal} cbOK={alGuardar} titulo={modalTitle} txtOK='ADD STUDENT' txtCancel='Cancel' />
    </div>
    {/* ================================
                    PIE
    ===================================*/}
    <footer id='pie'>
      <p className={`text-xs sm:text-base`}>{sitio.pie}</p>
    </footer>
  </Estilo>
  );
};

export default App;
