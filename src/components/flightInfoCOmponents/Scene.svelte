<script>
    import { T, useTask, useThrelte } from '@threlte/core'
    import { OrbitControls, interactivity, useTexture, useGltf, MeshLineGeometry, MeshLineMaterial  } from '@threlte/extras'
    //import {Spring} from 'svelte/motion'
    import { CatmullRomCurve3, Vector3 } from 'three'
    import { Stars} from '@threlte/extras'
    import { FakeGlowMaterial } from '@threlte/extras'
    const curve = new CatmullRomCurve3([
      new Vector3(-7, 3.9, 6),
      new Vector3(-1.9, 7, 8),
      new Vector3(8, 10.6, 9),
      new Vector3(14.75, 13, 9.5)
    ])
    

    const points = curve.getPoints(100)
    const starTexture = useTexture('stars.png')
const globeTexture = useTexture('globe.jpg')

    interactivity()
    const scale = 2
    const airplane = useGltf('boeing2.glb')
    const globe = useGltf('globe.glb')
    const path = useGltf('path.glb')
    
    
    let rotation = 0
    
    useTask((delta) => {
        rotation += (delta * 0.02)
    })

    import * as THREE from 'three';

    let globeRadius = 5;
    let pathPoints = [];

    for (let i = 0; i <= 100; i++) {
    let t = i / 100;
    let lat = (t * Math.PI) - (Math.PI / 2);
    let lon = t * Math.PI * 2;
    pathPoints.push(new THREE.Vector3(
        globeRadius * Math.cos(lat) * Math.cos(lon),
        globeRadius * Math.sin(lat),
        globeRadius * Math.cos(lat) * Math.sin(lon)
    ));
    }

    let pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform vec3 glowColor;
    uniform float glowIntensity;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
      gl_FragColor = vec4(glowColor, 1.0) * intensity * glowIntensity;
    }
  `

  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0xffffff) },
      glowIntensity: { value: 0.5 }
    },
    vertexShader,
    fragmentShader,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  })


  /// next bit just added
  const toonMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color: { value: new THREE.Color('#FDDA0D') },
    lightDirection: { value: new THREE.Vector3(1, 1, 1).normalize() }
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform vec3 lightDirection;
    varying vec3 vNormal;
    void main() {
      float intensity = max(0.0, dot(vNormal, lightDirection));
      if (intensity > 0.8) intensity = 1.0;
      else if (intensity > 0.5) intensity = 0.6;
      else intensity = 0.3;
      gl_FragColor = vec4(color * intensity, 1.0);
    }
  `
});
</script>



<div class="w-full h-full m-0-0">
  
  
    <T.PerspectiveCamera
      makeDefault
      position={[20, 20, 20]}  
      oncreate={(ref) => {
        ref.lookAt(0, 0, 0)
      }}
    >
    <OrbitControls enableDamping />
    </T.PerspectiveCamera>
    <T.DirectionalLight position={[15, 30, 70]} intensity={1} />
    <T.DirectionalLight position={[15, 30, -70]} intensity={1} />
    <T.Mesh
    rotation.y={rotation}
      scale={scale}
      
    
    >
    {#await globe then gltf}
    <T is={gltf.scene} 
       position = {[0,0,0]} 
       scale = {2}
       rotation.x={0}
       rotation.z = {0}
       rotation.y = {rotation}
       renderOrder={1}
       
    />
    {#await path then gltf}
  <T is={gltf.scene} 
    position={[0,0,0]} 
    scale={2}
    rotation.x={0}
    rotation.z={0}
    rotation.y={rotation}
    renderOrder={1}
    receiveShadow={false}
    on:create={({ ref }) => {
      ref.traverse((child) => {
        if (child.isMesh) {
          child.material = toonMaterial;
        }
      });
    }}
  />
{/await}
        <!-- <T.SphereGeometry args={[5, 64, 32]} /> -->
        <!-- <T.BoxGeometry args={[1, 2, 1]} />
        {#await useTexture('globe.jpg') then texture}
      <T.MeshStandardMaterial map={texture}
        emissive={0x3399ff}
        emissiveIntensity={0}/>
        {/await} -->
         
        <!-- <T.MeshBasicMaterial map={globalTexture} /> -->
    </T.Mesh>
    {#await airplane then gltf}
      <T is={gltf.scene} 
         position = {[0, 0, 0]} 
         scale = {4}
         rotation.x={0}
         rotation.z = {0}
         rotation.y = {0}
         renderOrder={1}
      />
  {/await}
  <Stars 
  radius={100}
  depth={50}
  count={5000}
  factor={4}
  saturation={0}
  fade
  speed={1}
/>
<!-- <T.Mesh>
  <T.SphereGeometry args={[7, 64, 62]} />
  {#await globeTexture then texture}
    <T.MeshStandardMaterial 
      map={texture}
      emissive={0xFFFFFFF0}
      emissiveIntensity={1}
    />
  {/await}
</T.Mesh> -->

<!-- <T.Mesh scale={1.01}>
  <T.SphereGeometry args={[15, 64, 64]} />
  <FakeGlowMaterial 
    glowColor="#0000FF"
    glowInternalRadius={3}
    glowSharpness={0.1}
    falloff = {5}
    saturation={1}
  />
</T.Mesh> -->
<T.Mesh scale={2.5}>
  <T.SphereGeometry args={[5, 64, 64]} />
  <FakeGlowMaterial 
    glowColor="#3399ff"
    glowInternalRadius={4.5}
    glowSharpness={10}
    falloff={0.5}
    opacity={0.1}
  />
</T.Mesh>
    

</div>
