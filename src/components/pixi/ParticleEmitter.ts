import { PixiComponent, applyDefaultProps, Container } from "@inlet/react-pixi";
import * as PIXI  from 'pixi.js';
import * as particles from 'pixi-particles';


interface Props  {
    image: string;
    config: particles.OldEmitterConfig | particles.EmitterConfig;
};

const ParticleEmitter = PixiComponent<Props & React.ComponentProps<typeof Container>, PIXI.ParticleContainer>("ParticleEmitter", {
    create() {
      return new PIXI.ParticleContainer();
    },

    applyProps(instance, oldProps: Props, newProps: Props) {
      const { image, config, ...newP } = newProps;
  
      // apply rest props to PIXI.ParticleContainer
      applyDefaultProps(instance, oldProps, newP);
      
      let emitter = (this as any)._emitter;
      if (!emitter) {
        emitter = new particles.Emitter(
          instance,
          [PIXI.Texture.from(image)],
          config
        );
  
        let elapsed = performance.now();
  
        const tick = () => {
          emitter.raf = requestAnimationFrame(tick);
          const now = performance.now();
          emitter.update((now - elapsed) * 0.0003);
  
          elapsed = now;
        };  
        emitter.emit = true;

        tick();
      }
      (this as any)._emitter = emitter;
    },

    willUnmount() {
      if ((this as any)._emitter) {
        (this as any)._emitter.emit = false;
        cancelAnimationFrame((this as any)._emitter.raf);
      }
    }
});

export default ParticleEmitter;