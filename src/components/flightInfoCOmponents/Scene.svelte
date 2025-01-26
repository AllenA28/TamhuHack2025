<script>
    import { T, useTask } from '@threlte/core'
    import { OrbitControls, interactivity, useTexture, useGltf, Stars } from '@threlte/extras'
    import { CatmullRomCurve3, Vector3 } from 'three'
    import { FakeGlowMaterial } from '@threlte/extras'
    import * as THREE from 'three';

    const curve = new CatmullRomCurve3([
        new Vector3(-7, 3.9, 6),
        new Vector3(-1.9, 7, 8),
        new Vector3(8, 10.6, 9),
        new Vector3(14.75, 13, 9.5)
    ])

    const points = curve.getPoints(100)
    const starTexture = useTexture('stars2.jpeg')
    const globeTexture = useTexture('earthmap1.webp')

    interactivity()
    const scale = 2
    const airplane = useGltf('boeing2.glb')
    const globe = useGltf('globe.glb')
    const path = useGltf('path.glb')

    let rotation = 0

    useTask((delta) => {
        rotation += (delta * 0.011)
    })

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

<div class="w-full h-full">
    <T.PerspectiveCamera
        makeDefault
        position={[19, 10, 24]}
        oncreate={(ref) => {
            ref.lookAt(0, 0, 0)
        }}
    >
        <OrbitControls enableDamping />
    </T.PerspectiveCamera>
    <T.DirectionalLight position={[15, 30, 70]} intensity={1}/>
    <T.DirectionalLight position={[13, 30, -70]} intensity={1} />
    <T.DirectionalLight position={[13, -30, 0]} intensity={1} />

    <T.Mesh rotation.y={rotation} scale={scale}>
        {#await globe then gltf}
            <T is={gltf.scene} 
                position={[0,0,0]} 
                scale={2}
                rotation.x={0}
                rotation.z={0}
                rotation.y={rotation-6.7}
                renderOrder={1}
            />
        {/await}

        {#await path then gltf}
            <T is={gltf.scene} 
                position={[0,0,0]} 
                scale={2}
                rotation.x={0}
                rotation.z={0}
                rotation.y={rotation-6.7}
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
    </T.Mesh>
    {#await airplane then gltf}
        <T is={gltf.scene} 
            position={[0, 0, 0]} 
            scale={4}
            rotation.x={0}
            rotation.z={0}
            rotation.y={0}
            renderOrder={1}
        />
    {/await}
    <Stars 
        radius={100}
        depth={100}
        count={50000}
        factor={4}
        saturation={0}
        fade
        speed={1}
    />
    <T.Mesh scale={2.5}>
        <T.SphereGeometry args={[5.5, 64, 64]} />
        <FakeGlowMaterial 
            glowColor="#1E5B99"
            glowInternalRadius={4.6}
            glowSharpness={5}
            falloff={0.5}
            opacity={0.1}
        />
    </T.Mesh>
</div>
