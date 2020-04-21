import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Stage, Sprite } from '@inlet/react-pixi';
import Viewport from './components/pixi/Viewport';
import { Viewport as PixiViewport } from "pixi-viewport";
import Marker from './components/pixi/Marker';
import { PixiPlugin } from 'gsap/all';
import { gsap } from 'gsap'
import SituationModal from './components/SituationModal';
import SituationOrder from './components/SituationOrder';
import './App.css';

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__ && window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
}

function App() {
  const viewportRef = useRef<PixiViewport>(null);
  const [selectedSituation, selectSituation] = useState<string | null>(null);
  const [situationOrder, setsituationOrder] = useState<string[]>([]);

  const worldWidth = 1920;
  const worldHeight = 1278;
  
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(600);

  useEffect(() => {
    // This will set the dimensions of the canvas to that of the window
    const resize = () => {
      const width = Math.min(window.innerWidth, window.outerWidth);
      const height = Math.min(window.innerHeight, window.outerHeight);
      setCanvasWidth(width);
      setCanvasHeight(height); 
    }
    resize();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    // Center the map
    if (viewportRef.current) {
      const viewport = viewportRef.current;
      viewport.moveCenter(worldWidth / 2, worldHeight / 2);  
    }
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    // Blur the map when situation is selected
    if (selectedSituation) {
      gsap.to(viewportRef.current, {duration: .5, pixi: {blur:20}});
    } else {
      gsap.to(viewportRef.current, {duration: .5, pixi: {blur:0}});
    }
  }, [selectedSituation]);

  const handleMarkerClick = (situation: string) => {
    selectSituation(situation);
  }

  const handleClose = () => {
    selectSituation(null);
  }

  const handleChooseOption = (option: number) => {
    setsituationOrder([
      ...situationOrder,
      selectedSituation!
    ])
  }

  const renderMarker = (situation: string, position: PIXI.Point, delay: number) => {
    if (situationOrder.some(s => s === situation)) {
      return null;
    }
    return <Marker position={position} pointerdown={() => handleMarkerClick(situation)} delay={delay} />
  }

  return (
    <>
      <Stage width={canvasWidth} height={canvasHeight} >
        <Viewport screenWidth={canvasWidth} screenHeight={canvasHeight} worldWidth={worldWidth} worldHeight={worldHeight} ref={viewportRef} >
          <Sprite image={`${process.env.PUBLIC_URL}/map.png`}  interactive={true}/>
          {renderMarker('fire', new PIXI.Point(440, 449), 0.5)}
          {renderMarker('theft', new PIXI.Point(986, 724), 1)}
          {renderMarker('absenteeism', new PIXI.Point(1437, 447), 1.5)}
      </Viewport>
    </Stage>
    <SituationOrder situationOrder={situationOrder} />
    { selectedSituation && <SituationModal situationId={selectedSituation} onClose={handleClose} onOptionChosen={handleChooseOption} /> }
    </>  
  )
};

export default App;

