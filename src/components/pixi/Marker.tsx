import React from 'react';
import { Sprite } from '@inlet/react-pixi';

const Marker = (props: React.ComponentProps<typeof Sprite>) => {
    return (
        <Sprite 
            { ...props }
            image={`${process.env.PUBLIC_URL}/marker.svg`}
        />
    );
}

export default Marker;