import {coolorsToHex, invertirPaleta, hex2rgb} from '../utils';
import { Breakpoints } from '../theme/types/css';
import { BorderRadiusSizes } from '../theme/types/shape';

const theme = {
    fonts: {
        primary: 'Rubik, sans-serif',
        secondary: 'Hurricane, cursive',
        code: 'Anonymous Pro, monospace',
        quote: 'Lora, serif'
    },
    palette: {
        btnPri: ['#e1a5b5', '#dc96a9', '#d7879d', '#d27891', '#b95f77', '#a4546a', '#904a5d', '#7b3f4f'],
        btnSec: ['#c0cbb0', '#b6c2a3', '#abba96', '#a1b189', '#87986f', '#788763', '#697656', '#5a654a'],
        basic:  ['#ffffff','#000000'], // Blanco->Negro
        greys: coolorsToHex('https://coolors.co/dfe2e2-a9b2b2-738282-444b4b-131515'), // Claro->Oscuro [0] Gainsboro [2] Web [4] Eerie black
        primary: coolorsToHex('https://coolors.co/faa275-ff8c61-ce6a85-985277-5c374c'), // Claro->Oscuro [0] Salmon [2] Satin [4] Byzantium | Lilas
        secondary: coolorsToHex('https://coolors.co/e9f5db-cfe1b9-97a97c-87986a-718355'), // Claro->Oscuro [0] Nyanza [2] Esparrago [4] Ruso | Verdes
    },
    media: {
        celular: '(min-width: 1px) and (max-width: 639px)',
        desktop: '(min-width: 1280px)',
        landscape: '(min-width: 460px) and (max-width : 639px)',
        laptop: '(min-width: 1024px) and (max-width: 1279px)',
        tablet: '(min-width: 640px) and (max-width: 1023px)',
        upto50em: '(max-width: 800px)',
        xs: '(max-width: 639px)',
        sm: '(min-width: 640px)',
        md: '(min-width: 768px)',
        lg: '(min-width: 992px)',
        xl: '(min-width: 1200px)',
        xxl: '(min-width: 1536px)',
        xxxl: '(min-width: 1600px)',
    },
};
theme.breakpoints = {
    [Breakpoints.Xs]: 0,
    [Breakpoints.Sm]: 576,
    [Breakpoints.Md]: 768,
    [Breakpoints.Lg]: 992,
    [Breakpoints.Xl]: 1200,
};
theme.gradients = {
    primary: `radial-gradient(farthest-side ellipse at 10% 0, ${theme.palette.secondary[2]} 25%, ${theme.palette.secondary[4]})`,
    secondary: `radial-gradient(farthest-side ellipse at 10% 0, ${theme.palette.primary[2]} 25%, ${theme.palette.primary[4]})`,
    light: `linear-gradient(farthest-side ellipse at 10% ${theme.palette.greys[1]}, ${theme.palette.greys[0]} 25%, ${theme.palette.greys[0]} 60%, ${theme.palette.basic[0]})`,
    dark: `radial-gradient(farthest-side ellipse at 10% 0, ${theme.palette.greys[4]} 33%, ${theme.palette.greys[3]} 66%, ${theme.palette.greys[2]} 100%)`,
};
theme.invertedPalette = invertirPaleta(theme.palette);
theme.shape = {
    borderRadius: {
      [BorderRadiusSizes.Sm]: '2px',
      [BorderRadiusSizes.Md]: '4px',
      [BorderRadiusSizes.Lg]: '8px',
    },
};
theme.transparencies= { // [0] Claro [1] Oscuro
    grays: [hex2rgb(theme.palette.greys[1], {alfa: 0.75, formato: 'css'}), hex2rgb(theme.palette.greys[3], {alfa: 0.75, formato: 'css'})],
    primary: [hex2rgb(theme.palette.primary[0], {alfa: 0.75, formato: 'css'}), hex2rgb(theme.palette.primary[4], {alfa: 0.75, formato: 'css'})],
    secondary: [hex2rgb(theme.palette.secondary[0], {alfa: 0.75, formato: 'css'}), hex2rgb(theme.palette.secondary[4], {alfa: 0.75, formato: 'css'})],
};

export default theme;