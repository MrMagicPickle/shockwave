import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import { TextureLoader } from 'three';

export default function ShaderMaterial() {
  const shockwaveTexture = useLoader(TextureLoader, '/shockwave.jpg');
  const uniforms = useMemo(() => ({
    uTime: {
      value: 0.0,
    },
    uShockwaveTexture: {
      value: shockwaveTexture,
    }
  }), []);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = modelPosition.xyz;
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      gl_Position = projectedPosition;
    }
  `

  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    uniform sampler2D uShockwaveTexture;
    uniform float uTime;

    void main() {
      vec3 origin = vec3(0.);
      float dist = distance(vWorldPosition, origin);
      float radialMoveA = dist - uTime;

      radialMoveA = fract(radialMoveA);

      // We need this to create a singular ring.
      float radialMove = - radialMoveA;
      radialMove = abs(radialMove);

      radialMove = smoothstep(0., 0.15, radialMove);
      radialMove = 1.- radialMove;

      radialMove += mix(0., 0.9, smoothstep(0., 0.1, radialMove));
      radialMove *= 1. - smoothstep(0., 2., dist);

      vec4 scan = texture2D(uShockwaveTexture, fract(vUv * 10.));
      float scanMix = radialMove * scan.r;
      vec3 scanColor = mix(vec3(0.), vec3(0.9, 0.8, .01), scanMix);
      scanColor = mix(vec3(0.), vec3(0.9, 0.7, .01), scanColor);
      gl_FragColor = vec4(mix(vec3(vUv.xy, 0.8), scanColor, scanMix), 1.);
    }
  `

  return <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        />
}