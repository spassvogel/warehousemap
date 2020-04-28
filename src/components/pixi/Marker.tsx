import React, { useRef, useEffect, useState } from 'react';
import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import { PixiPlugin } from 'gsap/all';
import { gsap } from 'gsap'

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

interface Props {
    position?: PIXI.Point;
    delay?: number; // Wait this long before showing
}

const Marker = (props: Props & React.ComponentProps<typeof Sprite>) => {
    const ref = useRef<PIXI.Sprite>(null);
    const data = useRef<PIXI.interaction.InteractionData>();
    const [position, setPosition] = useState<PIXI.Point>(props.position || new PIXI.Point());

    useEffect(() => {
        // Pop in animation!
        gsap.from(ref.current, { 
          duration: 1,
          ease: "elastic.out(2, 0.5)",
          pixi: { 
            visible: false,
            scale: .1, 
          }
        }).delay(props.delay || 0);
    }, [props.delay]);

    const onDragStart = (event: PIXI.interaction.InteractionEvent) => {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        data.current = event.data;
        event.stopPropagation(); // Stop dragging the map!
    }
    
    const onDragEnd = () => {
        data.current = undefined;
        console.log(position);
    }
    
    const onDragMove = () => {
        if (data.current)
        {
            const newPosition = data.current.getLocalPosition(ref.current!.parent);
            setPosition(newPosition);
        }
    }
    
    return (
        <Sprite 
            { ...props }
            anchor={[0.5, 0.5]}
            position={position}
            ref={ref}
            interactive={true}
            image={`${process.env.PUBLIC_URL}/images/ui/marker.svg`}
            mousedown={onDragStart}
            touchstart={onDragStart}
            mouseup={onDragEnd}
            mouseupoutside={onDragEnd}
            mousemove={onDragMove}
            touchmove={onDragMove}
        />
    );
}

export default Marker;