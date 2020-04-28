import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Stage, Sprite } from '@inlet/react-pixi';
import Viewport from './components/pixi/Viewport';
import { Viewport as PixiViewport } from "pixi-viewport";
import Marker from './components/pixi/Marker';
import { PixiPlugin } from 'gsap/all';
import { gsap } from 'gsap'
import './App.css';
import ParticleEmitter from './components/pixi/ParticleEmitter';
import smoke from './smoke.json';
import content from './content/parseContent';
import { AnyContent } from './common/constants';
import ContentModal from './components/contentModal';

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__ && window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
}

function App() {
  const viewportRef = useRef<PixiViewport>(null);
  const forkliftRef = useRef<PIXI.Sprite>(null);
  const [selectedContent, selectContent] = useState<AnyContent | null>(null);

  const worldWidth = 3588;
  const worldHeight = 2388;
  const scaleFactor = 1.86875; //scaled the original map up

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
    if (selectedContent) {
      gsap.to(viewportRef.current, {duration: .5, pixi: {blur:20}});
    } else {
      gsap.to(viewportRef.current, {duration: .5, pixi: {blur:0}});
    }
  }, [selectedContent]);

  const handleMarkerClick = (content: AnyContent) => {
    selectContent(content);
  }

  const handleClose = () => {
    selectContent(null);
  }

  // const handleChooseOption = (option: number) => {
  //   setsituationOrder([
  //     ...situationOrder,
  //     selectedSituation!
  //   ])
  // }

  useEffect(() => {
    // The forklift drives a square
    const forklift = forkliftRef!.current!;
    var tl = gsap.timeline({repeat: -1, repeatDelay: 1});
    tl.to(forklift, {
      pixi: { 
        x: 1143 * scaleFactor,
        y: 667 * scaleFactor
      }, 
      duration: 5
    });
    tl.to(forklift, {
      pixi: { 
        x: 1423 * scaleFactor,
        y: 545 * scaleFactor
      }, 
      duration: 2
    });
    tl.to(forklift, {
      pixi: { 
        x: 750 * scaleFactor,
        y: 347 * scaleFactor,
      }, 
      duration: 2
    });
    tl.to(forklift, {
      onStart: () => { forklift.scale = new PIXI.Point(-1, 1) },
      onComplete: () => { forklift.scale = new PIXI.Point(1, 1) },
      pixi: { 
        x: 477 * scaleFactor,
        y: 510 * scaleFactor
      }, 
      duration: 2
    });
  }, []);

  // const renderMarker = (situation: string, position: PIXI.Point, delay: number) => {
  //   if (situationOrder.some(s => s === situation)) {
  //     return null;
  //   }
  //   return <Marker position={position} pointerdown={() => handleMarkerClick(situation)} delay={delay} />
  // }
  const renderMarker = (contentItem: AnyContent, delay: number) => {
    const position = new PIXI.Point(contentItem.position[0], contentItem.position[1]);
    return (
      <Marker position={position} 
        pointerdown={() => handleMarkerClick(contentItem)}
        delay={delay} />
    );
  }

  return (
    <>
      <Stage width={canvasWidth} height={canvasHeight} >
        <Viewport screenWidth={canvasWidth} screenHeight={canvasHeight} worldWidth={worldWidth} worldHeight={worldHeight} ref={viewportRef} >
          <Sprite image={`${process.env.PUBLIC_URL}/images/map/map.jpg`}  />
          <Sprite image={`${process.env.PUBLIC_URL}/images/map/forklift1.png`} x={477 * scaleFactor} y={510 * scaleFactor} ref={forkliftRef}>
      
          </Sprite>
          {/* {renderMarker('fire', new PIXI.Point(440 * scaleFactor, 449 * scaleFactor), 0.5)}
          {renderMarker('theft', new PIXI.Point(986 * scaleFactor, 724 * scaleFactor), 1)}
          {renderMarker('absenteeism', new PIXI.Point(1437 * scaleFactor, 447 * scaleFactor), 1.5)} */}
          <ParticleEmitter
              name="smoke"
              x={1931}
              y={1293}
              image={`${process.env.PUBLIC_URL}/images/map/smoke.png`} 
              config={smoke} 
            />
          {content.map((contentItem, index) => renderMarker(contentItem, index * 0.5))}
        </Viewport>
      </Stage>
      {/* <SituationOrder situationOrder={situationOrder} /> */}
      { selectedContent && <ContentModal content={selectedContent} onClose={handleClose} /> }
    </>  
  )
};

export default App;

