import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Stage, Sprite } from '@inlet/react-pixi';
import Viewport from './components/pixi/Viewport';
import { Viewport as PixiViewport } from "pixi-viewport";
import Marker from './components/pixi/Marker';
import { PixiPlugin } from 'gsap/all';
import { gsap } from 'gsap'
import SituationModal from './components/SituationModal';
import './App.css';

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__ && window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
}

function App() {
  const viewportRef = useRef<PixiViewport>(null);
  const [situationSelected, selectSituation] = useState<string | null>(null);

  const worldWidth = 1920;
  const worldHeight = 1278;
  
  
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(600);

  useEffect(() => {
    // This will set the dimensions of the canvas to that of the window
    const resize = () => {
        setCanvasWidth(window.innerWidth);
        setCanvasHeight(window.innerHeight); 
    }
    resize();
    window.addEventListener("resize", resize);
    return () => {
        window.removeEventListener("resize", resize);
    };
}, []);

  useEffect(() => {
    if (viewportRef.current) {
      const viewport = viewportRef.current;
      viewport.moveCenter(worldWidth / 2, worldHeight / 2);  
    }
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    // Blur the map when situation is selected
    if (situationSelected) {
      gsap.to(viewportRef.current, {duration: .5, pixi: {blur:20}});
    } else {
      gsap.to(viewportRef.current, {duration: .5, pixi: {blur:0}});
    }
  }, [situationSelected]);

  const handleMarkerClick = (situation: string) => {
    selectSituation(situation);
  }

  const handleClose = () => {
    selectSituation(null);
  }

  const handleChooseOption = (option: number) => {
    console.log(option);
  }

  return (
    <>
      <Stage width={canvasWidth} height={canvasHeight} >
        <Viewport screenWidth={canvasWidth} screenHeight={canvasHeight} worldWidth={worldWidth} worldHeight={worldHeight} ref={viewportRef} >
          <Sprite image={`${process.env.PUBLIC_URL}/map.png`}  interactive={true}/>

          <Marker position={new PIXI.Point(440, 449)} pointerdown={() => handleMarkerClick('fire')} delay={.5} />
          <Marker position={new PIXI.Point(986, 724)} pointerdown={() => handleMarkerClick('theft')} delay={1} />
          <Marker position={new PIXI.Point(1437, 447)} pointerdown={() => handleMarkerClick('absenteeism')} delay={1.5} />
      </Viewport>
    </Stage>
    { situationSelected && <SituationModal situationId={situationSelected} onClose={handleClose} onOptionChosen={handleChooseOption} /> }
    </>  
  )
};

export default App;

