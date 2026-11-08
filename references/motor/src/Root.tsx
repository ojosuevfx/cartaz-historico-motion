import React from 'react';
import {Composition, Still} from 'remotion';
import {Banner} from './Banner';
import {Demo, DEMO_DUR} from './Demo';
import {EX_DUR, Exemplos} from './Exemplos';
import {Molde, MOLDE_T0, MOLDE_T1} from './Molde';
import {Aviso, AV_DUR} from './cenas/Aviso';

const FPS = 30;
const W = 1920, H = 1080;

// Registre aqui um <Composition> por capítulo, a partir do Molde. O `camada: true` deixa transparente o que não é cena.
export const Root: React.FC = () => (
  <>
    <Composition id="Molde" component={Molde} durationInFrames={Math.round((MOLDE_T1 - MOLDE_T0) * FPS)} fps={FPS} width={W} height={H} defaultProps={{camada: false}} />
    <Composition id="Demo" component={Demo} durationInFrames={Math.round(DEMO_DUR * FPS)} fps={FPS} width={W} height={H} defaultProps={{camada: false}} />
    <Composition id="Exemplos" component={Exemplos} durationInFrames={Math.round(EX_DUR * FPS)} fps={FPS} width={W} height={H} defaultProps={{camada: false}} />
    <Composition id="Aviso" component={Aviso} durationInFrames={Math.round(AV_DUR * FPS)} fps={FPS} width={W} height={H} defaultProps={{produtora: 'SEU CANAL'}} />
    <Still id="BannerReadme" component={Banner} width={1920} height={640} />
    <Still id="BannerSocial" component={Banner} width={1280} height={640} />
  </>
);
