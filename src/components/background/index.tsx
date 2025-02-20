import { useEffect, useRef } from "react";
import { CustomShaderRenderer } from "./custom-shader-renderer";
import './index.css';

const fragmentShader = /*glsl*/`
  precision mediump float;

  const float SCALE = 400.0;

  // const vec2 TILE_MOD = vec2(24.0, 4.0);
  const vec2 TILE_MOD = vec2(10.0, 4.0);

  uniform sampler2D uPrevFrame;
  uniform vec2 uResolution;
  uniform float uTime;
  // varying vec2 vUv;

  vec2 aspect(in vec2 res) {
    return res.x < res.y ? vec2(1.0, res.y / res.x) : vec2(res.x / res.y, 1.0);
  }

  float random (vec2 st) {return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}

  // Integer position in a grid defined by SCALE and 
  vec2 getIpos(vec2 uv) {
    return floor(uv * SCALE / TILE_MOD);
  }
  // Return uv center point of tile for x and y
  vec2 getUVFromIpos(vec2 iPos) {
    return (iPos * TILE_MOD + vec2(0.5)) / SCALE;
  }

  out vec4 fragColor;

  void main() {
    vec2 aspect = aspect(uResolution);
    vec2 uv = gl_FragCoord.xy/uResolution.xy; // * aspect;
    float time = uTime / 50.0;
    
    vec2 ipos = getIpos(uv);
    
    // Create initial random tile pattern
    vec3 initialColor = vec3(random(ipos) > 0.995 ? 1.0 : 0.0);
    
    vec3 outColor;
    vec3 prevColor = texture(uPrevFrame, gl_FragCoord.xy/uResolution.xy).rgb;
    
    
    // NEED TO LOOK UP FROM TEXTURE USING IPOS of NEIGHBOURING TILES ?

    if (texture(uPrevFrame, getUVFromIpos(ipos + 1.0)).r > 0.0) {
      outColor = vec3(0.0, 0.0, 1.0);

    } else if (texture(uPrevFrame, getUVFromIpos(ipos - 1.0)).r > 0.0) {
      outColor = vec3(0.0, 1.0, 1.0);

    } else if (texture(uPrevFrame, getUVFromIpos(ipos + vec2(0.0, 1.0))).r > 0.0) {
      outColor = vec3(0.0, 0.5, 0.5);

    } else if (texture(uPrevFrame, getUVFromIpos(ipos + vec2(0.0, -1.0))).r > 0.0) {
      outColor = vec3(0.0, 0.25, 0.75);

    } else {      
      outColor = prevColor;
    }

    // Set initial state then use previous frame
    vec3 color = time > 0.005 ? outColor : initialColor;

    fragColor = vec4(color, 1.0);
  }
`;

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