import styled from "styled-components";

const Estilo = styled.section` /* MOBILE FIRST APPROACH */
    z-index: 1;
    background: ${props => props.theme.gradients.secondary};
    color: ${props => props.theme.palette.primary[0]};
    font-family: ${props => props.theme.primary};

    .efecto--blur {
      backdrop-filter: blur(5px);
    }

    .centrar--elemento {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    a {
        outline: none;
        color: ${props => props.theme.palette.primary[2]};
        text-decoration: none;
        &:hover, &:focus {
            color: ${props => props.theme.palette.primary[1]};
            outline: none;
        }
    }
    /* ENCABEZADO Y PIE DE PAGINA
    ============================= */
    #encabezado, #pie  {
        display: flex;
        position: absolute;
        width: 100%;
        margin: 0;
        text-align: center;
        line-height: 1;
        pointer-events: none;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        white-space: nowrap;
        will-change: transform, opacity;
        transform-origin: 50% 40%;
        z-index: 5;
    }
    #pie  {
        bottom: 0px;
        color: ${props => props.theme.palette.primary[0]};
        p {
            font-size: 0.75rem;
        }
        
        @media screen and ${props => props.theme.media.md} { // a partir de 768px
            bottom: -.35vh;
        }
    }
    .cargando { /* Efecto "Cargando" */
        &:after {
            content: '';
            opacity: 1;
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: 100;
            top: 50%;
            left: 50%;
            width: 90px;
            height: 90px;
            margin: -45px 0 0 -45px;
            pointer-events: none;
            border: 3px solid ${props => props.theme.palette.primary[1]};
            border-right-color: ${props => props.theme.palette.primary[2]};
            border-radius: 50%;
            -webkit-transition: opacity 0.3s;
            transition: opacity 0.3s;
            -webkit-animation: rotarCirculo 0.7s linear infinite forwards;
            animation: rotarCirculo 0.7s linear infinite forwards;
        }
    }
    @-webkit-keyframes rotarCirculo { to { -webkit-transform: rotate(360deg); transform: rotate(360deg); } }
    @keyframes rotarCirculo {
        to {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    
    /* Modal */
    .modalSobreponer {
        background: rgba(36, 123, 160, 0.7);
    }
    .modalConfig {
        background: #b2dbbf;
        max-width: 500px;
        width: 100%;
    }
    .cursor {
	    display: none;
    }
    @media (any-pointer: fine) {
        .cursor {
            position: fixed;
            top: 0;
            left: 0;
            display: block;
            pointer-events: none;
        }
    }
`;
export default Estilo;