import { useEffect, useRef } from "react";
import { CustomShaderRenderer } from "./custom-shader-renderer";
import './index.css';

const fragmentShader = `
  precision mediump float;

  uniform sampler2D uPrevFrame;
  uniform vec2 uResolution;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    // Simply output a solid blue color.
    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
  }
`


export const Background = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    const shaderRenderer = new CustomShaderRenderer(
      canvas.current,
      fragmentShader,
    );

    shaderRenderer.start();
  }, [canvas]);

  return (
    <canvas ref={canvas} />
  );
}