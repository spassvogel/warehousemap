import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Stage, Sprite } from '@inlet/react-pixi';
import Viewport from './components/pixi/Viewport';
import { Viewport as PixiViewport } from "pixi-viewport";
import Marker from './components/pixi/Marker';
import { PixiPlugin } from 'gsap/all';
import { gsap } from 'gsap'
import Modal from 'react-modal';
import Situations from './content/situations.json';
import { ReactComponent as CheckSvg } from './images/ui/check.svg';
import './App.css';

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

  const openSituation = situationSelected ? (Situations as Situations)[situationSelected] : null;
  const [selectedOption, selectOption] = useState<number>();

  return (
    <>
      <Stage width={canvasWidth} height={canvasHeight} >
        <Viewport screenWidth={canvasWidth} screenHeight={canvasHeight} worldWidth={worldWidth} worldHeight={worldHeight} ref={viewportRef} >
          <Sprite image={`${process.env.PUBLIC_URL}/map.png`} pointerdown={() => selectSituation(undefined)} interactive={true}/>

          <Marker position={new PIXI.Point(440, 449)} pointerdown={() => selectSituation('fire')} delay={.5} />
          <Marker position={new PIXI.Point(986, 724)} pointerdown={() => selectSituation('theft')} delay={1} />
          <Marker position={new PIXI.Point(1437, 447)} pointerdown={() => selectSituation('absenteeism')} delay={1.5} />
      </Viewport>
    </Stage>
    <Modal
        isOpen={situationSelected !== undefined}
        ariaHideApp={false}
        overlayClassName={"modal-overlay"}
        className={"modal-content"}
        onRequestClose={() => selectSituation(undefined)}
      >
        { situationSelected && (
          <>
            <h1>{openSituation!.header} </h1>
            <div className="modal-close" onClick={() => selectSituation(undefined)}></div>
            <p>
               {openSituation!.description}
            </p>
            <ul className="options">
              {openSituation?.options.map((option, index) => (
                <li key={option} className={index === selectedOption ? "active" : ""} onClick={() => selectOption(index)} >
                  <div className="checkbox">
                    <CheckSvg className="check" />
                    {/* <img src={"images/ui/check.svg"} className="check" /> */}
                  </div>
                  <div>
                    {option}
                  </div>
                </li>
              ))}
            </ul>
            <button>Okay</button>
          </>
        )}
    </Modal>

  </>
  );
}

export default App;

interface Situations {
  [name: string]: Situation
}

interface Situation {
  header: string;
  description: string;
  options: string[];
}