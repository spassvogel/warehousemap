import React, { useRef, useEffect, useState } from 'react';
import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

interface Props {
    position?: PIXI.Point;
}

const Marker = (props: Props & React.ComponentProps<typeof Sprite>) => {
    const ref = useRef<PIXI.Sprite>(null);
    const data = useRef<PIXI.interaction.InteractionData>();
    const [position, setPosition] = useState<PIXI.Point>(props.position || new PIXI.Point());

    const onDragStart = (event: PIXI.interaction.InteractionEvent) => {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        data.current = event.data;
        console.log(event)
        event.stopPropagation(); // Stop dragging the map!
    }
    
    const onDragEnd = () => {
        data.current = undefined;
        console.log(position);
    }
    
    function onDragMove()
    {
        if (data.current)
        {
            const newPosition = data.current.getLocalPosition(ref.current!.parent);
            setPosition(newPosition);
        }
    }
    

    return (
        <Sprite 
            { ...props }
            width={54}
            height={72}
            position={position}
            ref={ref}
            interactive={true}
            image={`${process.env.PUBLIC_URL}/marker.svg`}
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