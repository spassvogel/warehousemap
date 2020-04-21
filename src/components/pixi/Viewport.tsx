import React from "react";
import { Viewport as PixiViewport, ClickEventData } from "pixi-viewport";
import { PixiComponent, useApp } from "@inlet/react-pixi";

interface Props {
  children: React.ReactNode;
  onClick?(event: ClickEventData): void;
  screenWidth: number,
  screenHeight: number,
  worldWidth: number,
  worldHeight: number,
  minScale?: number;
  maxScale?: number;
}

/** Viewport leverages pixi-viewport to create a pannable map 
 * https://davidfig.github.io/pixi-viewport/jsdoc/
 */
const Viewport = React.forwardRef<PixiViewport, any>((props, ref) => {
  const app = useApp();
  if (app) {
      // Perhaps this is better moved somewhere else
      const cursor = `url('${process.env.PUBLIC_URL}/img/cursors/dwarven_gauntlet_extra_6.png'), auto`;
      app.renderer.plugins.interaction.cursorStyles.pointer = cursor;
  }
  return <PixiComponentViewport app={app} {...props} ref={ref} />;  
})

interface PixiComponentProps {
    app: PIXI.Application;
}

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentProps & Props) => {
    const viewport = new PixiViewport({
      screenWidth: props.screenWidth,
      screenHeight: props.screenHeight,
      worldWidth: props.worldWidth,
      worldHeight: props.worldHeight,
      ticker: props.app.ticker,
      interaction: props.app.renderer.plugins.interaction,
      // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    const { 
      minScale = .5, 
      maxScale = 1 
    } = props;
    
    viewport
      .drag()
      .pinch()
      .wheel()
      .clamp({ direction: 'all' })
      .clampZoom({ minScale, maxScale })
      .decelerate();

    return viewport;
  },
});
export default Viewport;
