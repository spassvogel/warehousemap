import React, { useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { Stage, Sprite } from '@inlet/react-pixi';
import Viewport from './components/pixi/Viewport';
import { Viewport as PixiViewport } from "pixi-viewport";
import Marker from './components/pixi/Marker';

function App() {
  console.log(process.env.PUBLIC_URL);
  const viewportRef = useRef<PixiViewport>(null);

  const canvasWidth = 1200;
  const canvasHeight = 600;
  const worldWidth = 1920;
  const worldHeight = 1278;

  return (
    <Stage width={canvasWidth} height={canvasHeight} >
        <Viewport screenWidth={canvasWidth} screenHeight={canvasHeight} worldWidth={worldWidth} worldHeight={worldHeight} ref={viewportRef} >

          <Sprite image={`${process.env.PUBLIC_URL}/map.png`} />
          <Marker />
    </Viewport> 
  </Stage>
  );
}

export default App;
