import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import './App.css';
import { Stage, Sprite } from '@inlet/react-pixi';
import Viewport from './components/pixi/Viewport';
import { Viewport as PixiViewport } from "pixi-viewport";
import Marker from './components/pixi/Marker';
import { PixiPlugin } from 'gsap/all';
import { gsap } from 'gsap'

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

//window.PIXI = PIXI;

if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__ && window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
}

function App() {
  const viewportRef = useRef<PixiViewport>(null);
  const [situationSelected, selectSituation] = useState<string>();

  const canvasWidth = 1200;
  const canvasHeight = 600;
  const worldWidth = 1920;
  const worldHeight = 1278;

  useEffect(() => {
    if (viewportRef.current) {
      const viewport = viewportRef.current;
      viewport.moveCenter(worldWidth / 2, worldHeight / 2);
    }
  }, []);

  useEffect(() => {
    // Blur the map when situation is selected
    if (situationSelected) {
      gsap.to(viewportRef.current, {duration: .5, pixi: {blur:20}});
    } else {
      gsap.to(viewportRef.current, {duration: .5, pixi: {blur:0}});
    }
  }, [situationSelected]);

  return (
    <Stage width={canvasWidth} height={canvasHeight} >
      <Viewport screenWidth={canvasWidth} screenHeight={canvasHeight} worldWidth={worldWidth} worldHeight={worldHeight} ref={viewportRef} >
        <Sprite image={`${process.env.PUBLIC_URL}/map.png`} pointerdown={() => selectSituation(undefined)} interactive={true}/>

        <Marker position={new PIXI.Point(440, 449)} pointerdown={() => selectSituation('fire')} delay={.5} />
        <Marker position={new PIXI.Point(986, 724)} pointerdown={() => selectSituation('theft')} delay={1} />
        <Marker position={new PIXI.Point(1437, 411)} pointerdown={() => selectSituation('absenteism')} delay={1.5} />
    </Viewport> 
  </Stage>
  );
}

export default App;
