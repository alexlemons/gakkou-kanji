// CODE GEN PROMPT: TODO

import * as THREE from 'three';

// A simple default vertex shader that passes through positions and UVs.
const defaultVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export class CustomShaderRenderer {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private quad: THREE.Mesh;
  private uniforms: {
    uPrevFrame: { value: THREE.Texture | null };
    uResolution: { value: THREE.Vector2 };
    uTime: { value: number };
  };

  // Two render targets for ping-pong rendering
  private renderTargetA: THREE.WebGLRenderTarget;
  private renderTargetB: THREE.WebGLRenderTarget;
  private currentTarget: THREE.WebGLRenderTarget;
  private previousTarget: THREE.WebGLRenderTarget;

  // A second scene and camera to copy the current frame to the canvas.
  private copyScene: THREE.Scene;
  private copyCamera: THREE.OrthographicCamera;
  private copyMesh: THREE.Mesh;

  private startTime: number;

  /**
   * @param canvas A reference to the HTMLCanvasElement to render to.
   * @param fragmentShader The custom fragment shader as a string.
   */
  constructor(canvas: HTMLCanvasElement, fragmentShader: string) {
    this.canvas = canvas;
    this.startTime = Date.now();

    // Create the WebGL renderer using the provided canvas.
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Create an orthographic camera and scene for our shader pass.
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Setup our uniforms.
    this.uniforms = {
      // This uniform will hold the previous frame’s texture.
      uPrevFrame: { value: null },
      // The resolution of the canvas.
      uResolution: { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) },
      // Time in seconds.
      uTime: { value: 0.0 },
    };

    // Create our ShaderMaterial using the default vertex shader and provided fragment shader.
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: defaultVertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      glslVersion: THREE.GLSL3,
    });

    // Create a full-screen quad (a plane that covers clip space) and add it to the scene.
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.quad = new THREE.Mesh(geometry, shaderMaterial);
    this.scene.add(this.quad);

    // Create two render targets (off-screen framebuffers) for ping-pong rendering.
    const rtParams = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    };
    this.renderTargetA = new THREE.WebGLRenderTarget(canvas.clientWidth, canvas.clientHeight, rtParams);
    this.renderTargetB = new THREE.WebGLRenderTarget(canvas.clientWidth, canvas.clientHeight, rtParams);
    this.currentTarget = this.renderTargetA;
    this.previousTarget = this.renderTargetB;

    // Setup a second scene to copy the current frame to the actual canvas.
    this.copyScene = new THREE.Scene();
    this.copyCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const copyMaterial = new THREE.MeshBasicMaterial({ map: this.currentTarget.texture });
    this.copyMesh = new THREE.Mesh(geometry, copyMaterial);
    this.copyScene.add(this.copyMesh);

    // Bind the animation loop so that "this" is correct.
    this.animate = this.animate.bind(this);
  }

  /**
   * Starts the render loop.
   */
  public start(): void {
    this.animate();
  }

  /**
   * The animation loop.
   */
  private animate(): void {
    requestAnimationFrame(this.animate);

    // Update uniforms.
    const elapsedTime = (Date.now() - this.startTime) / 1000;
    this.uniforms.uTime.value = elapsedTime;
    // Pass the texture from the previous frame.
    this.uniforms.uPrevFrame.value = this.previousTarget.texture;

    // Render our shader scene into the current render target (off-screen).
    this.renderer.setRenderTarget(this.currentTarget);
    this.renderer.render(this.scene, this.camera);

    // Render the current render target to the canvas.
    // Update the copy mesh material so it displays the most recent frame.
    (this.copyMesh.material as THREE.MeshBasicMaterial).map = this.currentTarget.texture;
    (this.copyMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.copyScene, this.copyCamera);

    // Swap the render targets for ping-pong rendering.
    [this.currentTarget, this.previousTarget] = [this.previousTarget, this.currentTarget];
  }
}