<script>
    import { T, useTask, useThrelte } from '@threlte/core'
    import { interactivity, useTexture, useGltf } from '@threlte/extras'
    import {Spring} from 'svelte/motion'
    

    interactivity()
    const scale = 2
    const airplane = useGltf('boeing.glb')
    

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

</script>



<div class="w-full h-full m-0-0">
  
  
    <T.PerspectiveCamera
      makeDefault
      position={[20, 20, 20]}  
      oncreate={(ref) => {
        ref.lookAt(0, 0, 0)
      }}
    />
    <T.DirectionalLight position={[15, 30, 70]} />
    <T.Mesh
    rotation.y={rotation}
      scale={scale}
      
    
    >
        <T.SphereGeometry args={[5, 64, 62]}  />
        <!--<T.BoxGeometry args={[1, 2, 1]} />-->
        {#await useTexture('globe.jpg') then texture}
      <T.MeshStandardMaterial map={texture} />
        {/await}
         
        <!--<T.MeshBasicMaterial map={globalTexture} /> -->
    </T.Mesh>
    {#await airplane then gltf}
      <T is={gltf.scene} position = {[10,12,10]} scale = {0.057}
         rotation.x={25}
         rotation.z = {30.5}
         rotation.y = {24.25}
      />
  {/await}
    <T.Line geometry={pathGeometry}>
    <T.LineBasicMaterial color="red" linewidth={3} />
    </T.Line>

</div>
