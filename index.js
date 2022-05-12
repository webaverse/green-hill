import * as THREE from 'three';

import metaversefile from 'metaversefile';

const { useApp, useFrame, useInternals, useLocalPlayer, useLoaders, usePhysics, useCleanup } = metaversefile;
const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');


export default () => {
  const app = useApp();
  const { renderer, camera } = useInternals();
  const localPlayer = useLocalPlayer();
  const physics = usePhysics();
  const textureLoader = new THREE.TextureLoader();
  const voronoiNoiseTexture = textureLoader.load(`${baseUrl}/textures/voronoiNoise.jpg`);
  const simpleNoiseTexture = textureLoader.load(`${baseUrl}/textures/simpleNoise4.jpg`);
  const oneMinusTexture = textureLoader.load(`${baseUrl}/textures/oneMinus2.png`);
  const maskTexture = textureLoader.load(`${baseUrl}/textures/mask4.png`);
  const splashTexture1 = textureLoader.load(`${baseUrl}/textures/splash1.png`);
  
  const splashTexture2 = textureLoader.load(`${baseUrl}/textures/sphere2.png`)
  let waterfallmesh = null;
  //####################################################### load greenhiill glb ####################################################
  {
    
    let greenhill;
    (async () => {
        const u = `${baseUrl}/assets/greenhill4.glb`;
        greenhill = await new Promise((accept, reject) => {
            const {gltfLoader} = useLoaders();
            gltfLoader.load(u, accept, function onprogress() {}, reject);
            
        });
        greenhill.scene.position.y=50;
        physics.addGeometry(greenhill.scene);
        
        
        app.add(greenhill.scene);
        app.updateMatrixWorld();
    })();
    (async () => {
        const u = `${baseUrl}/assets/waterfall4.glb`;
        
        waterfallmesh = await new Promise((accept, reject) => {
            const {gltfLoader} = useLoaders();
            gltfLoader.load(u, accept, function onprogress() {}, reject);
            
        });
       
    })();
    useCleanup(() => {
      
      physics.removeGeometry(greenhill.scene);
      
    });
    

  }
  //####################################################### load waterfall glb ####################################################
  {
    
    let waterfall = null;
    
        const material= new THREE.ShaderMaterial({
          uniforms: {
              uTime: {
                  value: 0,
              },
              opacity: {
                  value: 0,
              },
              avatarPos:{
                  value: new THREE.Vector3(0,0,0)
              },
              iResolution: { value: new THREE.Vector3() },
              voronoiNoiseTexture:{
                  value:voronoiNoiseTexture
              },
              simpleNoiseTexture:{
                  value:simpleNoiseTexture
              },
              oneMinusTexture:{
                  value:oneMinusTexture
              },
              maskTexture:{
                  value:maskTexture
              }
          },
          vertexShader: `\
              
              ${THREE.ShaderChunk.common}
              ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
          
          
              uniform float uTime;
      
              varying vec2 vUv;
              varying vec3 vPos;
              varying vec4 vColor;

              uniform sampler2D voronoiNoiseTexture;
              uniform sampler2D simpleNoiseTexture;
              uniform sampler2D oneMinusTexture;
              uniform sampler2D maskTexture;

          
              void main() {
              vUv=uv;
              vPos=position;
              vec4 voronoiNoise = texture2D(
                              voronoiNoiseTexture,
                              vec2(
                                  vUv.x,
                                  mod(1.2*vUv.y-uTime*1.,1.)
                              )
              );
              vec4 simpleNoise = texture2D(
                              simpleNoiseTexture,
                              vUv
              );
              vec4 oneMinus = texture2D(
                              oneMinusTexture,
                              vUv
              );
              vec4 mask = texture2D(
                              maskTexture,
                              vUv
              );

              voronoiNoise *= voronoiNoise *voronoiNoise * voronoiNoise* voronoiNoise* voronoiNoise;
              voronoiNoise += oneMinus *oneMinus *oneMinus *oneMinus * simpleNoise;
              voronoiNoise *= mask * mask;
              vColor = voronoiNoise;
              
              vPos.y += voronoiNoise.r / (5.);
              vec4 modelPosition = modelMatrix * vec4(vPos, 1.0);
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectionPosition = projectionMatrix * viewPosition;
      
              gl_Position = projectionPosition;
              ${THREE.ShaderChunk.logdepthbuf_vertex}
              }
          `,
          fragmentShader: `\
              ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
              varying vec4 vColor;
              void main() {
                
                gl_FragColor= vColor * vec4(0.166, 0.819, 0.920, 1.0) * 2.;
                
              ${THREE.ShaderChunk.logdepthbuf_fragment}
              }
          `,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,

          // clipping: false,
          // fog: false,
          // lights: false,
      });
      
    
    useFrame(({ timestamp }) => {
      if(waterfallmesh && waterfall === null){
        waterfall = waterfallmesh.scene.clone();
        waterfall.position.y=50;
        waterfall.children[0].material = material;
        app.add(waterfall);
      }
      if(waterfall)
        waterfall.children[0].material.uniforms.uTime.value = timestamp / 1000;
        
      app.updateMatrixWorld();
    });

  }
  //####################################################### load waterfall glb ####################################################
  {
    
    let waterfall = null;
    
        const material= new THREE.ShaderMaterial({
          uniforms: {
              uTime: {
                  value: 0,
              },
              opacity: {
                  value: 0,
              },
              avatarPos:{
                  value: new THREE.Vector3(0,0,0)
              },
              iResolution: { value: new THREE.Vector3() },
              voronoiNoiseTexture:{
                  value:voronoiNoiseTexture
              },
              simpleNoiseTexture:{
                  value:simpleNoiseTexture
              },
              oneMinusTexture:{
                  value:oneMinusTexture
              },
              maskTexture:{
                  value:maskTexture
              }
          },
          vertexShader: `\
              
              ${THREE.ShaderChunk.common}
              ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
          
          
              uniform float uTime;
      
              varying vec2 vUv;
              varying vec3 vPos;
              varying vec4 vColor;

              uniform sampler2D voronoiNoiseTexture;
              uniform sampler2D simpleNoiseTexture;
              uniform sampler2D oneMinusTexture;
              uniform sampler2D maskTexture;

          
              void main() {
              vUv=uv;
              vPos=position;
              vec4 voronoiNoise = texture2D(
                              voronoiNoiseTexture,
                              vec2(
                                  vUv.x,
                                  mod(1.2*vUv.y-uTime*1.,1.)
                              )
              );
              vec4 simpleNoise = texture2D(
                              simpleNoiseTexture,
                              vUv
              );
              vec4 oneMinus = texture2D(
                              oneMinusTexture,
                              vUv
              );
              vec4 mask = texture2D(
                              maskTexture,
                              vUv
              );

              voronoiNoise *= voronoiNoise *voronoiNoise * voronoiNoise* voronoiNoise* voronoiNoise;
              voronoiNoise += oneMinus * simpleNoise;
              voronoiNoise *= mask * mask;
              
              
              vColor = voronoiNoise;
              
              vPos.y += voronoiNoise.r / (3.5);
              vec4 modelPosition = modelMatrix * vec4(vPos, 1.0);
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectionPosition = projectionMatrix * viewPosition;
      
              gl_Position = projectionPosition;
              ${THREE.ShaderChunk.logdepthbuf_vertex}
              }
          `,
          fragmentShader: `\
              ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
              varying vec4 vColor;
              void main() {
                
                gl_FragColor= vColor;
                // if(gl_FragColor.r > 0.5)
                //   gl_FragColor.rgb *= 10.;
                // else
                //   gl_FragColor.rgb /= 10.;
                gl_FragColor.a = gl_FragColor.r;
                
              ${THREE.ShaderChunk.logdepthbuf_fragment}
              }
          `,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,

          // clipping: false,
          // fog: false,
          // lights: false,
      });
      
    
    useFrame(({ timestamp }) => {
      if(waterfallmesh && waterfall === null){
        waterfall = waterfallmesh.scene.clone();
        waterfall.position.y=50;
        waterfall.children[0].material = material;
        app.add(waterfall);
      }
      if(waterfall)
        waterfall.children[0].material.uniforms.uTime.value = timestamp / 1000;
        
      app.updateMatrixWorld();
    });

  }
  //####################################################### load waterfall glb ####################################################
  {
    
    let waterfall = null;
    
        const material= new THREE.ShaderMaterial({
          uniforms: {
              uTime: {
                  value: 0,
              },
              opacity: {
                  value: 0,
              },
              avatarPos:{
                  value: new THREE.Vector3(0,0,0)
              },
              iResolution: { value: new THREE.Vector3() },
              voronoiNoiseTexture:{
                  value:voronoiNoiseTexture
              },
              simpleNoiseTexture:{
                  value:simpleNoiseTexture
              },
              oneMinusTexture:{
                  value:oneMinusTexture
              },
              maskTexture:{
                  value:maskTexture
              }
          },
          vertexShader: `\
              
              ${THREE.ShaderChunk.common}
              ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
          
          
              uniform float uTime;
      
              varying vec2 vUv;
              varying vec3 vPos;

          
              void main() {
              vUv=uv;
              vPos=position;
              vec4 modelPosition = modelMatrix * vec4(position, 1.0);
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectionPosition = projectionMatrix * viewPosition;
      
              gl_Position = projectionPosition;
              ${THREE.ShaderChunk.logdepthbuf_vertex}
              }
          `,
          fragmentShader: `\
              ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
              uniform float uTime;
              uniform float opacity;
              uniform vec3 iResolution;
              uniform vec3 avatarPos;
              varying vec2 vUv;
              varying vec3 vPos;

              
              uniform sampler2D simpleNoiseTexture;
              uniform sampler2D oneMinusTexture;
              uniform sampler2D maskTexture;
              
              
              void main() {
                
                vec4 simpleNoise = texture2D(
                                  simpleNoiseTexture,
                                  vUv
                );
                vec4 oneMinus = texture2D(
                                  oneMinusTexture,
                                  vUv
                );
                vec4 mask = texture2D(
                                  maskTexture,
                                  vUv
                );
                
                
                
                // gl_FragColor = vec4(0.166, 0.819, 0.920, 1.0) + oneMinus * oneMinus *oneMinus*oneMinus*oneMinus*oneMinus * simpleNoise;
                gl_FragColor = vec4(0.0388, 0.613, 0.970, 1.0) + oneMinus * oneMinus *oneMinus*oneMinus*oneMinus*oneMinus * simpleNoise;
                
                gl_FragColor*= mask * mask;
                
              ${THREE.ShaderChunk.logdepthbuf_fragment}
              }
          `,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,

          // clipping: false,
          // fog: false,
          // lights: false,
      });
      
    
    useFrame(({ timestamp }) => {
      if(waterfallmesh && waterfall === null){
        waterfall = waterfallmesh.scene.clone();
        waterfall.position.y=50;
        waterfall.children[0].material = material;
        app.add(waterfall);
      }
      if(waterfall)
        waterfall.children[0].material.uniforms.uTime.value = timestamp / 1000;
        
      app.updateMatrixWorld();
    });

  }
  //####################################################### load campfire glb ####################################################
  {
    
    let campfire;
    (async () => {
        const u = `${baseUrl}/assets/campfire.glb`;
        campfire = await new Promise((accept, reject) => {
            const {gltfLoader} = useLoaders();
            gltfLoader.load(u, accept, function onprogress() {}, reject);
            
        });
        campfire.scene.position.set(-75.1,101,40.5);
        campfire.scene.scale.set(0.45,0.45,0.45);
        physics.addGeometry(campfire.scene);
        
        
        app.add(campfire.scene);
        app.updateMatrixWorld();
    })();
    useCleanup(() => {
      
        physics.removeGeometry(campfire.scene);
      
    });
    

  }

  //####################################################### upward fireflies #######################################################
  {
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 1500;

    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 180;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const scaleArray = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      scaleArray[i] = Math.random() * 10;
    }
    particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

    const twinkArray = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      twinkArray[i] = Math.random() * 2;
    }
    particlesGeometry.setAttribute('twink', new THREE.BufferAttribute(twinkArray, 1))

    const yellow = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      yellow[i] = Math.random();
    }
    particlesGeometry.setAttribute('yellow', new THREE.BufferAttribute(yellow, 1))



    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.1,
      color: 0xaaaaaa,
    })
    particlesMaterial.depthWrite = false



    const uniforms = {
      time: {
        value: 0
      },
      highY: {
        value: 35
      },
      lowY: {
        value: -10
      }
    }
    particlesMaterial.onBeforeCompile = shader => {
      shader.uniforms.time = uniforms.time;
      shader.uniforms.highY = uniforms.highY;
      shader.uniforms.lowY = uniforms.lowY;
      //console.log(shader.vertexShader);
      shader.vertexShader = `
        uniform float time;
        uniform float highY;
        uniform float lowY;
        attribute float aScale;
        attribute float twink;
        varying vec2 vUv;
        varying float vYellow;
        attribute float yellow;
      ` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
       
          float totalY = highY + lowY;
          transformed.y = highY + mod(highY - (transformed.y - time * .5), totalY);
         
          transformed.x += sin(time*0.01 + transformed.y * 0.5+transformed.z*0.5) + uv.y * 5.;
          transformed.z += sin(time*0.01 + transformed.x * 0.5+transformed.y*0.5) + uv.x * 5.;
          vUv=uv;
          vYellow=yellow;
        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        `gl_PointSize = size;`,
        `gl_PointSize = size*aScale*cos(time*twink);`
      );
      shader.fragmentShader = `varying vec2 vUv;varying float vYellow;` +
        shader.fragmentShader
          .replace(
            `vec4 diffuseColor = vec4( diffuse, opacity );`,
            `
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float opacity = 0.05 / distanceToCenter;
            float strength = 0.015 / (distance(gl_PointCoord, vec2(0.5)));
            vec4 diffuseColor= vec4(vec3(strength),opacity/10.);
            if(vYellow>0.5)
              diffuseColor.b-=0.6;
           
          `
          );

    }
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    app.add(particles);



    useFrame(({ timestamp }) => {
      uniforms.time.value = timestamp / 700;
    });
  }

  //####################################################### downward fireflies #######################################################
  {
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 1500;

    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 180;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const scaleArray = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      scaleArray[i] = Math.random() * 10;
    }
    particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

    const twinkArray = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      twinkArray[i] = Math.random() * 2;
    }
    particlesGeometry.setAttribute('twink', new THREE.BufferAttribute(twinkArray, 1))

    const yellow = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      yellow[i] = Math.random();
    }
    particlesGeometry.setAttribute('yellow', new THREE.BufferAttribute(yellow, 1))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.1,
      color: 0xaaaaaa,
    })
    particlesMaterial.depthWrite = false



    const uniforms = {
      time: {
        value: 0
      },
      highY: {
        value: 35
      },
      lowY: {
        value: -10
      }
    }
    particlesMaterial.onBeforeCompile = shader => {
      shader.uniforms.time = uniforms.time;
      shader.uniforms.highY = uniforms.highY;
      shader.uniforms.lowY = uniforms.lowY;
      //console.log(shader.vertexShader);
      shader.vertexShader = `
        uniform float time;
        uniform float highY;
        uniform float lowY;
        attribute float aScale;
        attribute float twink;
        varying vec2 vUv;
        varying float vYellow;
        attribute float yellow;
      ` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
       
          float totalY = highY + lowY;
          transformed.y = highY + mod(highY - (transformed.y + time * .5), totalY);
         
          transformed.x += sin(time*0.01 + transformed.y * 0.5+transformed.z*0.5) + uv.y * 5.;
          transformed.z += sin(time*0.01 + transformed.x * 0.5+transformed.y*0.5) + uv.x * 5.;
          vUv=uv;
          vYellow=yellow;
        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        `gl_PointSize = size;`,
        `gl_PointSize = size*aScale*cos(time*twink);`
      );
      shader.fragmentShader = `varying vec2 vUv;varying float vYellow;` +
        shader.fragmentShader
          .replace(
            `vec4 diffuseColor = vec4( diffuse, opacity );`,
            `
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float opacity = 0.05 / distanceToCenter;
            float strength = 0.015 / (distance(gl_PointCoord, vec2(0.5)));
            vec4 diffuseColor= vec4(vec3(strength),opacity/10.);
            if(vYellow>0.5)
              diffuseColor.b-=0.6;
           
          `
          );

    }
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    app.add(particles);



    useFrame(({ timestamp }) => {
      uniforms.time.value = timestamp / 700;
    });
  }



  //####################################################### bird #######################################################
  {
    const rnd = (max, negative) => {
      return negative ? Math.random() * 2 * max - max : Math.random() * max;
    }
    const limit = (number, min, max) => {
      return Math.min(Math.max(number, min), max);
    }
    let destination = new THREE.Vector3(0, 0, 0);

    //######## object #########
    const geometry = new THREE.BufferGeometry()


    const positions = new Float32Array(9)
    positions[0] = 0;
    positions[1] = 0;
    positions[2] = 0;
    positions[3] = 0;
    positions[4] = -0.5;
    positions[5] = 0;
    positions[6] = 1.25;
    positions[7] = -0.25;
    positions[8] = 0;

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const leftWing = new THREE.Mesh(geometry, material);



    const lwing = new THREE.Group();
    lwing.add(leftWing);

    const rightWing = new THREE.Mesh(geometry, material);
    rightWing.rotation.y = Math.PI;


    const rwing = new THREE.Group();
    rwing.add(rightWing);




    const bodyGeometry = new THREE.BufferGeometry()


    const positions2 = new Float32Array(9)
    positions2[0] = 0;
    positions2[1] = 0.6;
    positions2[2] = 0;
    positions2[3] = 0;
    positions2[4] = -0.6;
    positions2[5] = 0.1;
    positions2[6] = 0;
    positions2[7] = -0.6;
    positions2[8] = -0.1;

    bodyGeometry.setAttribute('position', new THREE.BufferAttribute(positions2, 3));


    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.y -= 0.15;

    const group = new THREE.Group();
    group.add(body);
    group.add(lwing);
    group.add(rwing);
    group.rotation.x = Math.PI / 2;
    group.rotation.y = Math.PI;
    group.scale.set(1.2, 1.2, 1.2);



    const birds = new THREE.Group();
    for (let i = 0; i < 10; i++) {
      const g = group.clone();
      g.attraction = Math.random() / 100;
      g.position.x = Math.random() * 300;
      g.position.z = Math.random() * 300;
      g.velocity = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true));
      birds.add(g);

    }
    birds.position.y = 250;
    birds.position.z -= 50;
    birds.scale.set(1, 1, 1);
    app.add(birds);


    let count = 0;
    useFrame(({ timestamp }) => {

      for (let i = 0; i < birds.children.length; i++) {
        const dv = destination.clone().sub(birds.children[i].position).normalize();
        birds.children[i].velocity.x += birds.children[i].attraction * dv.x;
        birds.children[i].velocity.y += birds.children[i].attraction * dv.y;
        birds.children[i].velocity.z += birds.children[i].attraction * dv.z;
        birds.children[i].velocity.x = limit(birds.children[i].velocity.x, -0.8, 0.8);
        birds.children[i].velocity.y = limit(birds.children[i].velocity.y, -0.8, 0.8);
        birds.children[i].velocity.z = limit(birds.children[i].velocity.z, -0.8, 0.8);
        birds.children[i].children[1].rotation.y = Math.cos(timestamp / 300);
        birds.children[i].children[2].rotation.y = -Math.cos(timestamp / 300);
        const v2 = birds.children[i].velocity;

        birds.children[i].lookAt(birds.children[i].position.clone().add(v2));

        birds.children[i].position.add(v2);
        birds.children[i].children[0].updateMatrixWorld();
        birds.children[i].children[1].updateMatrixWorld();
        birds.children[i].children[2].updateMatrixWorld();

        if (count % 1000 == 0) {
          birds.children[i].attraction = Math.random() / 200;
          birds.children[i].velocity.x = rnd(1, true);
          birds.children[i].velocity.y = rnd(1, true);
          birds.children[i].velocity.z = rnd(1, true);
        }
      }

    });
    count++;

  }


  //####################################################### purple butterfly #######################################################
  {
    const rnd = (max, negative) => {
      return negative ? Math.random() * 2 * max - max : Math.random() * max;
    }
    const limit = (number, min, max) => {
      return Math.min(Math.max(number, min), max);
    }
    let destination = new THREE.Vector3(0, 0, 0);

    const bodyTexture = textureLoader.load(`${baseUrl}/textures/body.png`);
    const wingTexture = textureLoader.load(`${baseUrl}/textures/butterfly-wing3.png`);


    //######## object #########
    const geometry = new THREE.PlaneGeometry(1, 1.5);
    const material = new THREE.MeshBasicMaterial({ transparent: true, map: wingTexture, side: THREE.DoubleSide, transparent: true, depthWrite: false });
    const leftWing = new THREE.Mesh(geometry, material);
    leftWing.position.x = -0.55;

    const lwing = new THREE.Group();
    lwing.add(leftWing);

    const rightWing = new THREE.Mesh(geometry, material);
    rightWing.rotation.y = Math.PI;
    rightWing.position.x = 0.55;

    const rwing = new THREE.Group();
    rwing.add(rightWing);


    const geometry2 = new THREE.PlaneGeometry(1, 1.5);
    const material2 = new THREE.MeshBasicMaterial({ transparent: true, map: bodyTexture, side: THREE.DoubleSide, transparent: true, depthWrite: false });
    const body = new THREE.Mesh(geometry2, material2);

    const group = new THREE.Group();
    group.add(body);
    group.add(lwing);
    group.add(rwing);
    group.rotation.x = Math.PI / 2;
    group.rotation.y = Math.PI;
    group.scale.set(0.5, 0.5, 0.5);



    const butterflies = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const g = group.clone();
      g.attraction = Math.random() / 20;
      g.position.x = Math.random() * 3;
      g.position.z = Math.random() * 3;
      g.velocity = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true));
      butterflies.add(g);

    }
    butterflies.position.y = 52;
    //butterflies.position.z -= 50;
    butterflies.scale.set(0.2, 0.2, 0.2);
    app.add(butterflies);

    let butterflyLocation = new THREE.Vector3(0, 50, -50);
    let count = 0;
    useFrame(({ timestamp }) => {
      if (count % 1000 === 0) {
        butterflyLocation.x = Math.random() * 100;
        butterflyLocation.z = Math.random() * 100;
        destination.x = Math.random() * 100;
        destination.y = Math.random() * 100;
        destination.z = Math.random() * 100;

      }
      for (let i = 0; i < butterflies.children.length; i++) {
        const dv = destination.clone().sub(butterflies.children[i].position).normalize();
        butterflies.children[i].velocity.x += butterflies.children[i].attraction * dv.x;
        butterflies.children[i].velocity.y += butterflies.children[i].attraction * dv.y;
        butterflies.children[i].velocity.z += butterflies.children[i].attraction * dv.z;
        butterflies.children[i].velocity.x = limit(butterflies.children[i].velocity.x, -0.5, 0.5);
        butterflies.children[i].velocity.y = limit(butterflies.children[i].velocity.y, -0.5, 0.5);
        butterflies.children[i].velocity.z = limit(butterflies.children[i].velocity.z, -0.5, 0.5);
        butterflies.children[i].children[1].rotation.y = Math.cos(timestamp * .011 * butterflies.children[i].velocity.x);
        butterflies.children[i].children[2].rotation.y = -Math.cos(timestamp * .011 * butterflies.children[i].velocity.x);
        const v2 = butterflies.children[i].velocity;

        butterflies.children[i].lookAt(butterflies.children[i].position.clone().add(v2));

        butterflies.children[i].position.add(v2);
        butterflies.children[i].children[0].updateMatrixWorld();
        butterflies.children[i].children[1].updateMatrixWorld();
        butterflies.children[i].children[2].updateMatrixWorld();

        if (count % 1000 == 0) {
          butterflies.children[i].attraction = Math.random() * 200;
          butterflies.children[i].velocity.x = rnd(1, true);
          butterflies.children[i].velocity.y = rnd(1, true);
          butterflies.children[i].velocity.z = rnd(1, true);
        }
      }
      const d = butterflyLocation.sub(butterflies.position).normalize();
      if (butterflyLocation.x > butterflies.position.x)
        butterflies.position.x += d.x / 100.;
      else
        butterflies.position.x -= d.x / 100.;
      if (butterflyLocation.z > butterflies.position.z)
        butterflies.position.z += d.z / 100.;
      else
        butterflies.position.z -= d.z / 100.;
      butterflies.updateMatrixWorld();

    });
    count++;

  }

  //####################################################### orange butterfly #######################################################
  {
    const rnd = (max, negative) => {
      return negative ? Math.random() * 2 * max - max : Math.random() * max;
    }
    const limit = (number, min, max) => {
      return Math.min(Math.max(number, min), max);
    }
    let destination = new THREE.Vector3(0, 1, 0);

    const bodyTexture = textureLoader.load(`${baseUrl}/textures/body.png`);
    const wingTexture = textureLoader.load(`${baseUrl}/textures/butterfly-wing1.png`);


    //######## object #########
    const geometry = new THREE.PlaneGeometry(1, 1.5);
    const material = new THREE.MeshBasicMaterial({ transparent: true, map: wingTexture, side: THREE.DoubleSide, transparent: true, depthWrite: false });
    const leftWing = new THREE.Mesh(geometry, material);
    leftWing.position.x = -0.55;

    const lwing = new THREE.Group();
    lwing.add(leftWing);

    const rightWing = new THREE.Mesh(geometry, material);
    rightWing.rotation.y = Math.PI;
    rightWing.position.x = 0.55;

    const rwing = new THREE.Group();
    rwing.add(rightWing);


    const geometry2 = new THREE.PlaneGeometry(1, 1.5);
    const material2 = new THREE.MeshBasicMaterial({ transparent: true, map: bodyTexture, side: THREE.DoubleSide, transparent: true, depthWrite: false });
    const body = new THREE.Mesh(geometry2, material2);

    const group = new THREE.Group();
    group.add(body);
    group.add(lwing);
    group.add(rwing);
    group.rotation.x = Math.PI / 2;
    group.rotation.y = Math.PI;
    group.scale.set(0.5, 0.5, 0.5);



    const butterflies = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const g = group.clone();
      g.attraction = Math.random() / 20;
      g.position.x = Math.random() * 3;
      g.position.z = Math.random() * 3;
      g.velocity = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true));
      butterflies.add(g);

    }
    butterflies.position.y = 52;
    butterflies.position.z -= 10;
    butterflies.position.x += 40;
    butterflies.scale.set(0.2, 0.2, 0.2);
    app.add(butterflies);

    let butterflyLocation = new THREE.Vector3(0, -80, 150);
    let count = 0;
    useFrame(({ timestamp }) => {
      if (count % 1000 === 0) {
        butterflyLocation.x = Math.random() * 10;
        butterflyLocation.z = Math.random() * 10;
        destination.x = Math.random() * 10;
        destination.y = Math.random() * 10;
        destination.z = Math.random() * 10;

      }
      for (let i = 0; i < butterflies.children.length; i++) {
        const dv = destination.clone().sub(butterflies.children[i].position).normalize();
        butterflies.children[i].velocity.x += butterflies.children[i].attraction * dv.x;
        butterflies.children[i].velocity.y += butterflies.children[i].attraction * dv.y;
        butterflies.children[i].velocity.z += butterflies.children[i].attraction * dv.z;
        butterflies.children[i].velocity.x = limit(butterflies.children[i].velocity.x, -0.5, 0.5);
        butterflies.children[i].velocity.y = limit(butterflies.children[i].velocity.y, -0.5, 0.5);
        butterflies.children[i].velocity.z = limit(butterflies.children[i].velocity.z, -0.5, 0.5);
        butterflies.children[i].children[1].rotation.y = Math.cos(timestamp * .011 * butterflies.children[i].velocity.x);
        butterflies.children[i].children[2].rotation.y = -Math.cos(timestamp * .011 * butterflies.children[i].velocity.x);
        const v2 = butterflies.children[i].velocity;

        butterflies.children[i].lookAt(butterflies.children[i].position.clone().add(v2));

        butterflies.children[i].position.add(v2);
        butterflies.children[i].children[0].updateMatrixWorld();
        butterflies.children[i].children[1].updateMatrixWorld();
        butterflies.children[i].children[2].updateMatrixWorld();

        if (count % 1000 == 0) {
          butterflies.children[i].attraction = Math.random() * 200;
          butterflies.children[i].velocity.x = rnd(1, true);
          butterflies.children[i].velocity.y = rnd(1, true);
          butterflies.children[i].velocity.z = rnd(1, true);
        }
      }
      const d = butterflyLocation.sub(butterflies.position).normalize();
      if (butterflyLocation.x > butterflies.position.x)
        butterflies.position.x += d.x / 100.;
      else
        butterflies.position.x -= d.x / 100.;
      if (butterflyLocation.z > butterflies.position.z)
        butterflies.position.z += d.z / 100.;
      else
        butterflies.position.z -= d.z / 100.;
      butterflies.updateMatrixWorld();

    });
    count++;

  }

  //####################################################### blue butterfly #######################################################
  {
    const rnd = (max, negative) => {
      return negative ? Math.random() * 2 * max - max : Math.random() * max;
    }
    const limit = (number, min, max) => {
      return Math.min(Math.max(number, min), max);
    }
    let destination = new THREE.Vector3(1, 0, 0);

    const bodyTexture = textureLoader.load(`${baseUrl}/textures/body.png`);
    const wingTexture = textureLoader.load(`${baseUrl}/textures/butterfly-wing2.png`);


    //######## object #########
    const geometry = new THREE.PlaneGeometry(1, 1.5);
    const material = new THREE.MeshBasicMaterial({ transparent: true, map: wingTexture, side: THREE.DoubleSide, transparent: true, depthWrite: false });
    const leftWing = new THREE.Mesh(geometry, material);
    leftWing.position.x = -0.55;

    const lwing = new THREE.Group();
    lwing.add(leftWing);

    const rightWing = new THREE.Mesh(geometry, material);
    rightWing.rotation.y = Math.PI;
    rightWing.position.x = 0.55;

    const rwing = new THREE.Group();
    rwing.add(rightWing);


    const geometry2 = new THREE.PlaneGeometry(1, 1.5);
    const material2 = new THREE.MeshBasicMaterial({ transparent: true, map: bodyTexture, side: THREE.DoubleSide, transparent: true, depthWrite: false });
    const body = new THREE.Mesh(geometry2, material2);

    const group = new THREE.Group();
    group.add(body);
    group.add(lwing);
    group.add(rwing);
    group.rotation.x = Math.PI / 2;
    group.rotation.y = Math.PI;
    group.scale.set(0.5, 0.5, 0.5);



    const butterflies = new THREE.Group();
    for (let i = 0; i < 7; i++) {
      const g = group.clone();
      g.attraction = Math.random() / 20;
      g.position.x = Math.random() * 3;
      g.position.z = Math.random() * 3;
      g.velocity = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true));
      butterflies.add(g);

    }
    butterflies.position.y = 52;
    butterflies.position.z -= 30;
    butterflies.position.x += 50;
    butterflies.scale.set(0.2, 0.2, 0.2);
    app.add(butterflies);

    let butterflyLocation = new THREE.Vector3(0, 50, -50);
    let count = 0;
    useFrame(({ timestamp }) => {
      if (count % 1000 === 0) {
        butterflyLocation.x = Math.random() * 10;
        butterflyLocation.z = Math.random() * 10;
        destination.x = Math.random() * 1;
        destination.y = Math.random() * 1;
        destination.z = Math.random() * 1;

      }
      for (let i = 0; i < butterflies.children.length; i++) {
        const dv = destination.clone().sub(butterflies.children[i].position).normalize();
        butterflies.children[i].velocity.x += butterflies.children[i].attraction * dv.x;
        butterflies.children[i].velocity.y += butterflies.children[i].attraction * dv.y;
        butterflies.children[i].velocity.z += butterflies.children[i].attraction * dv.z;
        butterflies.children[i].velocity.x = limit(butterflies.children[i].velocity.x, -0.5, 0.5);
        butterflies.children[i].velocity.y = limit(butterflies.children[i].velocity.y, -0.5, 0.5);
        butterflies.children[i].velocity.z = limit(butterflies.children[i].velocity.z, -0.5, 0.5);
        butterflies.children[i].children[1].rotation.y = Math.cos(timestamp * .011 * butterflies.children[i].velocity.x);
        butterflies.children[i].children[2].rotation.y = -Math.cos(timestamp * .011 * butterflies.children[i].velocity.x);
        const v2 = butterflies.children[i].velocity;

        butterflies.children[i].lookAt(butterflies.children[i].position.clone().add(v2));

        butterflies.children[i].position.add(v2);
        butterflies.children[i].children[0].updateMatrixWorld();
        butterflies.children[i].children[1].updateMatrixWorld();
        butterflies.children[i].children[2].updateMatrixWorld();

        if (count % 1000 == 0) {
          butterflies.children[i].attraction = Math.random() * 200;
          butterflies.children[i].velocity.x = rnd(1, true);
          butterflies.children[i].velocity.y = rnd(1, true);
          butterflies.children[i].velocity.z = rnd(1, true);
        }
      }
      const d = butterflyLocation.sub(butterflies.position).normalize();
      if (butterflyLocation.x > butterflies.position.x)
        butterflies.position.x += d.x / 1000.;
      else
        butterflies.position.x -= d.x / 1000.;
      if (butterflyLocation.z > butterflies.position.z)
        butterflies.position.z += d.z / 1000.;
      else
        butterflies.position.z -= d.z / 1000.;
      butterflies.updateMatrixWorld();

    });
    count++;

  }

  //####################################################### sea ############################################################
  {
    const geometry = new THREE.PlaneGeometry( 60, 60 );
    
    const vertexShader = `
      ${THREE.ShaderChunk.common}
      ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
      varying vec2 vUv;
      varying vec3 vPos;
      uniform float iTime;
  
      void main() {
          vPos=position;
          vUv = uv;
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
  
          gl_Position = projectedPosition;
          ${THREE.ShaderChunk.logdepthbuf_vertex}
      }
      `;
      const fragmentShader = `
      ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
      #include <common>
      
      uniform vec3 iResolution;
      uniform float iTime;
      varying vec2 vUv;
      varying vec3 vPos;
      #define TAU 6.28318530718
      
      vec2 ToPolar(vec2 v)
      {
          return vec2(atan(v.y, v.x), length(v));
      }
      vec2 hash2( vec2  p ) { p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) ); return fract(sin(p)*43758.5453); }
      vec2 voronoi( in vec2 x, float w , float time)
      {
          vec2 n = floor( x );
          vec2 f = fract( x );
          vec2 m = vec2(8.0, 0.0);
          for( int j=-1; j<=1; j++ )
          for( int i=-1; i<=1; i++ )
          {
              vec2 g = vec2( float(i),float(j) );
              vec2 o = hash2( n + g );
              o = 0.5 + 0.5 * sin( time + 6.2831 * o );
              float d = length(g - f + o);  
              float h = smoothstep( 0.0, 1.0, 0.5 + 0.5*(m.x-d)/w );
              m.x = mix( m.x,    d, h ) - h*(1.0-h)*w/(1.0+3.0*w); // distance
              m.y = mix( m.y, 0.75, h ) - h*(1.0-h)*w/(1.0+3.0*w);
          }
        
        return m;
      }
      
      float noise2( in vec2 p )
      {
            vec2 i = floor( p );
            vec2 f = fract( p );
          
            vec2 u = f*f*(3.0-2.0*f);
            return mix( mix( dot( hash2( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                            dot( hash2( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                        mix( dot( hash2( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                            dot( hash2( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
      }
      // mix two voronoi layers and ring
      float get_voronoi_texture(vec2 p, float fade, float time) {
            vec2 op = p;
            // two voronoi
            p = ToPolar(p) * 01.175;
            p.y += -time * 0.51;
            p.x = abs(p.x) * 4.;
            vec2 td = voronoi(p * vec2(2.5, 1.185), 0.51, time * .1);
            vec2 td2 = voronoi(p * vec2(1.5, 1.185), 0.51, time * .05);
            td *= td2;
            // rings
            // adding rings to voronoi
            time += -0.35;
            p = op;
            p *= 0.05;
            float d = noise2(p * 4. + time * 0.51 * 0.05 * 8.);
            d = (fade * 0.235 +
                abs(mod(length(p) + 0.07 * d - time * 0.51 * 0.05 * 2., 0.15) - 0.075));
            float a = 1. - smoothstep(0.4485, 0.4485 + 0.005, td.y * .855 + d);
            td.y = min(td.y + fade * 15., 1.);
            float b = 1. - smoothstep(0.4785, 0.4785 + 0.005, td.y);
            return max(a, b);
      }
      float get_rings(vec2 p, float val, float time, float fade) {
            vec2 op = p;
            // one layer of voronoi
            p = ToPolar(p) * 01.5;
            p.y += -time * 0.51;
            p.x = abs(p.x) * .125;
            vec2 td = voronoi(p * vec2(2.5, 1.185), 0.51, time * .1);
            td.x = 1. - smoothstep(val, val + 0.005, td.x + fade);
            // rings
            p = op;
            p *= 0.05;
            float d = noise2(p * 4. + time * 0.51 * 0.05 * 8.);
            d = (1. - smoothstep(0.01, 0.015,
                                fade * 0.5 + abs(mod(length(p) + 0.07 * d -
                                                      time * 0.51 * 0.05 * 2.,
                                                      0.15) -
                                                      0.075)));
            return td.x * d;
      }
  
      
      vec3 lightPos = vec3(0.0, 50.0, 0.0);
      const vec3 bgcol = vec3(0x06, 0xb6, 0xf3) / float(0xff);
      const vec3 white = vec3(0xd1, 0xee, 0xf5) / float(0xff);
      const vec3 blue = vec3(0x01, 0x8e, 0xc6) / float(0xff);
      
      void rippleColor( out vec4 fragColor, in vec2 fragCoord ){
        vec2 uv = vUv* 2.0 - 1.0;
        //vec2 uv = fragCoord / iResolution.xy * 2.0 - 1.0;
        vec3 ro=vec3(0.,8.,-1.5);
        
        float screenSize = (1.0 / (tan(((180. - 100.0) * (3.1415926 / 180.0)) / 2.0)));
        float aspect = iResolution.x / iResolution.y;
        vec3 rd=normalize(vec3(uv * screenSize, 1.0 ));

        //########### use rotation matrix to rotate the cam #############
        mat3 rotY =
            mat3(cos(30.), 0.0, -sin(30.), 0.0, 1.0, 0.0, sin(30.), 0.0, cos(30.));
        mat3 rotX =
            mat3(1.0, 0.0, 0.0, 0.0, cos(-30.), sin(-30.), 0.0, -sin(-30.), cos(-30.));
            
        rd = (rotX) * rd;

        vec4 Plane = vec4(0., 1., 0., 0.);
        float t1 = -(dot(ro, Plane.xyz) + Plane.w) / dot(rd, Plane.xyz);
        vec3 norm= normalize(Plane.xyz);

        vec3 p = (ro + rd * t1);
        vec2 p2 = p.xz;
        
        float d = 0.;
        float fade = smoothstep(0.3, .845, length(p2* 0.05));
        fade = max(fade, 1. - (smoothstep(-0.075, 0.15, length(p2* 0.05))));
        d = get_voronoi_texture(p2,fade, iTime);
        d = min(d + get_rings(p2,  0.73, iTime, fade) +
                get_rings(p2,0.3, iTime * 0.75, fade),
                1.);
        fragColor = vec4(mix(blue * (max(dot(norm, normalize(lightPos - p)), 0.0) + 0.05), white, d), 1.);
      }
  
      
        
      
      void main() {
        vec4 test;
        rippleColor(test, vUv * iResolution.xy);
        if(test.r<0.8 && test.g<0.8)
          gl_FragColor.a=0.;
        else
          gl_FragColor = test;
        ${THREE.ShaderChunk.logdepthbuf_fragment}
      }
  `;
       
       
    const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3() },
        
    };
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite:false,
        blending:THREE.AdditiveBlending


    });
    
       
    const plane = new THREE.Mesh( geometry, material );
    plane.rotation.x=Math.PI/2;

    app.add( plane );
    plane.position.set(123.7, 0, -54.5);
    app.updateMatrixWorld();

    useFrame(({timestamp}) => {
      uniforms.iTime.value = timestamp /500;
      uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
      
    
    });
  }
  //###################################################################### splash ######################################################################
  {
    const particleCount = 100;
    
    let matrix = new THREE.Matrix4();
    let dummy = new THREE.Object3D();
    let info = {
        velocity: [particleCount]
    }
    let acc = new THREE.Vector3(0, -0.02, 0);

    //##################################################### get geometry #####################################################
    //const identityQuaternion = new THREE.Quaternion();
    const _getSplashGeometry = geometry => {
        //console.log(geometry)
        const geometry2 = new THREE.BufferGeometry();
        ['position', 'normal', 'uv'].forEach(k => {
          geometry2.setAttribute(k, geometry.attributes[k]);
        });
        geometry2.setIndex(geometry.index);
        
        const positions = new Float32Array(particleCount * 3);
        const positionsAttribute = new THREE.InstancedBufferAttribute(positions, 3);
        geometry2.setAttribute('positions', positionsAttribute);

        const color = new Float32Array(particleCount * 3);
        const colorsAttribute = new THREE.InstancedBufferAttribute(color, 3);
        geometry2.setAttribute('color', colorsAttribute);

        //const quaternions = new Float32Array(particleCount * 4);
        // for (let i = 0; i < particleCount; i++) {
        //   identityQuaternion.toArray(quaternions, i * 4);
        // }
        // const quaternionsAttribute = new THREE.InstancedBufferAttribute(quaternions, 4);
        // geometry2.setAttribute('quaternions', quaternionsAttribute);

        // const startTimes = new Float32Array(particleCount);
        // const startTimesAttribute = new THREE.InstancedBufferAttribute(startTimes, 1);
        // geometry2.setAttribute('startTimes', startTimesAttribute);

        const opacityAttribute = new THREE.InstancedBufferAttribute(new Float32Array(particleCount), 1);
        opacityAttribute.setUsage(THREE.DynamicDrawUsage);
        geometry2.setAttribute('opacity', opacityAttribute);

        const brokenAttribute = new THREE.InstancedBufferAttribute(new Float32Array(particleCount), 1);
        brokenAttribute.setUsage(THREE.DynamicDrawUsage);
        geometry2.setAttribute('broken', brokenAttribute);

        const scales = new Float32Array(particleCount);
        const scaleAttribute = new THREE.InstancedBufferAttribute(scales, 1);
        geometry2.setAttribute('scales', scaleAttribute);

        const random = new Float32Array(particleCount);
        const randomAttribute = new THREE.InstancedBufferAttribute(random, 1);
        geometry2.setAttribute('random', scaleAttribute);
    
        return geometry2;
    };

    //##################################################### material #####################################################
    const splashMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: {
                value: 0,
            },
            perlinnoise:{
                value: splashTexture1
            },
            cameraBillboardQuaternion: {
                value: new THREE.Quaternion(),
            },
        },
        vertexShader: `\
            
            ${THREE.ShaderChunk.common}
            ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
        
        
            uniform float uTime;
            uniform vec4 cameraBillboardQuaternion;
    
            varying vec2 vUv;
            varying vec3 vPos;
            varying vec3 vColor;
            varying float vBroken;
            varying float vOpacity;
            varying float vRandom;
            attribute vec3 positions;
            attribute vec3 color;
            attribute float scales;
            attribute vec4 quaternions;
            attribute float broken;
            attribute float opacity;
            attribute float random;
            vec3 qtransform(vec3 v, vec4 q) { 
              return v + 2.0*cross(cross(v, q.xyz ) + q.w*v, q.xyz);
            }
            vec3 rotateVecQuat(vec3 position, vec4 q) {
                vec3 v = position.xyz;
                return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
            }
        
            void main() {
              vBroken=broken;
              vOpacity=opacity;
              vColor = color;
              vRandom = random;
              vUv=uv;
              vPos=position;
              vec3 pos = position;
              pos = rotateVecQuat(pos, cameraBillboardQuaternion);
              pos*=scales;
              pos+=positions;
              //pos = qtransform(pos, quaternions);
              //pos.y=cos(uTime/100.);
              vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectionPosition = projectionMatrix * viewPosition;
      
              gl_Position = projectionPosition;
              ${THREE.ShaderChunk.logdepthbuf_vertex}
            }
        `,
        fragmentShader: `\
            ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
            uniform float uTime;
            varying float vBroken;
            varying float vOpacity;
            varying vec3 vColor;
            varying float vRandom;
            varying vec2 vUv;
            varying vec3 vPos;
            uniform sampler2D perlinnoise;
            
            #define PI 3.1415926
            
            
            
            
            void main() {
                
                float mid = 0.5;
                vec2 rotated = vec2(cos(vRandom*PI) * (vUv.x - mid) - sin(vRandom*PI) * (vUv.y - mid) + mid,
                            cos(vRandom*PI) * (vUv.y - mid) + sin(vRandom*PI) * (vUv.x - mid) + mid);
                
                // vec4 rotatedTexture = texture2D( texture,  rotated);
                vec4 ripple = texture2D(
                    perlinnoise,
                    rotated
                );


                gl_FragColor = ripple;
                if(gl_FragColor.r<vBroken){
                    discard;
                }
                
                gl_FragColor.rgb *= vColor; 
                gl_FragColor.a*=vOpacity;
            ${THREE.ShaderChunk.logdepthbuf_fragment}
            }
        `,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        
    });
    
   

    

    //##################################################### object #####################################################
    let mesh=null;
    const addInstancedMesh=()=>{
        const geometry2 = new THREE.PlaneGeometry( 10, 10 );
        const geometry =_getSplashGeometry(geometry2)
        mesh = new THREE.InstancedMesh(
            geometry,
            splashMaterial,
            particleCount
        );
        
        app.add(mesh);
        
        for (let i = 0; i < particleCount; i++) {
            
            info.velocity[i] = new THREE.Vector3();
            
        }
        
        
    }
    addInstancedMesh();
    

    let timer = 0;
    useFrame(({timestamp}) => {
        
   
       
        
        if (mesh) {
            const opacityAttribute = mesh.geometry.getAttribute('opacity');
            const brokenAttribute = mesh.geometry.getAttribute('broken');
            // const startTimesAttribute = mesh.geometry.getAttribute('startTimes');
            const positionsAttribute = mesh.geometry.getAttribute('positions');
            const scalesAttribute = mesh.geometry.getAttribute('scales');
            //const quaternionsAttribute = mesh.geometry.getAttribute('quaternions');
            const randomAttribute = mesh.geometry.getAttribute('random');
            const colorAttribute = mesh.geometry.getAttribute('color');
            for (let i = 0; i < particleCount; i++) {
                mesh.getMatrixAt(i, matrix);
                matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
                
                if(positionsAttribute.getY(i)<-0.5){
                    info.velocity[i].x=(Math.random()-0.5)*10;
                    info.velocity[i].y=10+(Math.random()-0.5)*5;
                    info.velocity[i].z=(Math.random()-0.5)*10;
                    
                        
                    info.velocity[i].divideScalar(20);
                    positionsAttribute.setXYZ(i,123.7+(Math.random()-0.5)*20, -0.5, -54.5+(Math.random()-0.5)*20);
                    brokenAttribute.setX(i, Math.random()*0.3+0.4);
                    opacityAttribute.setX(i, 1);
                    scalesAttribute.setX(i, 0.7);
                    randomAttribute.setX(i, Math.random());
                    colorAttribute.setXYZ(i, 0.0388, 0.892, 0.970);

                }

                if(positionsAttribute.getY(i)>=-100){
                    if(i % 2 === 0){
                      randomAttribute.setX(i, randomAttribute.getX(i)+0.01);
                    }
                    else{
                      randomAttribute.setX(i, randomAttribute.getX(i)-0.01);
                    }
                    colorAttribute.setXYZ(i,
                                          colorAttribute.getX(i)+0.03,
                                          colorAttribute.getY(i)+0.03,
                                          colorAttribute.getZ(i)+0.03,
                    );
                    positionsAttribute.setXYZ(  i, 
                                                positionsAttribute.getX(i)+info.velocity[i].x,
                                                positionsAttribute.getY(i)+info.velocity[i].y,
                                                positionsAttribute.getZ(i)+info.velocity[i].z
                                            );
                    //scalesAttribute.setX(i, scalesAttribute.getX(i)-0.015);
                    opacityAttribute.setX(i, opacityAttribute.getX(i)-0.005);
                    if(brokenAttribute.getX(i)<1.0)
                        brokenAttribute.setX(i, brokenAttribute.getX(i)+0.008);
                    
                    info.velocity[i].add(acc);
                }
                

            }
            
            mesh.instanceMatrix.needsUpdate = true;
            positionsAttribute.needsUpdate = true;
            opacityAttribute.needsUpdate = true;
            brokenAttribute.needsUpdate = true;
            scalesAttribute.needsUpdate = true;
            randomAttribute.needsUpdate = true;
            colorAttribute.needsUpdate = true;
            //quaternionsAttribute.needsUpdate = true;
            // startTimesAttribute.needsUpdate = true;
            mesh.material.uniforms.uTime.value=timestamp/1000;
            mesh.material.uniforms.cameraBillboardQuaternion.value.copy(camera.quaternion);
            timer++;

        }
        app.updateMatrixWorld();

        
    });
  }
  //###################################################################### splash particle ######################################################################
  {
    const particleCount = 30;
    
    let matrix = new THREE.Matrix4();
    let dummy = new THREE.Object3D();
    let info = {
        velocity: [particleCount]
    }
    let acc = new THREE.Vector3(0, -0.02, 0);

    //##################################################### get geometry #####################################################
    //const identityQuaternion = new THREE.Quaternion();
    const _getSplashGeometry = geometry => {
        //console.log(geometry)
        const geometry2 = new THREE.BufferGeometry();
        ['position', 'normal', 'uv'].forEach(k => {
          geometry2.setAttribute(k, geometry.attributes[k]);
        });
        geometry2.setIndex(geometry.index);
        
        const positions = new Float32Array(particleCount * 3);
        const positionsAttribute = new THREE.InstancedBufferAttribute(positions, 3);
        geometry2.setAttribute('positions', positionsAttribute);
        // const quaternions = new Float32Array(particleCount * 4);
        // for (let i = 0; i < particleCount; i++) {
        //   identityQuaternion.toArray(quaternions, i * 4);
        // }
        // const quaternionsAttribute = new THREE.InstancedBufferAttribute(quaternions, 4);
        // geometry2.setAttribute('quaternions', quaternionsAttribute);

        // const startTimes = new Float32Array(particleCount);
        // const startTimesAttribute = new THREE.InstancedBufferAttribute(startTimes, 1);
        // geometry2.setAttribute('startTimes', startTimesAttribute);

        const opacityAttribute = new THREE.InstancedBufferAttribute(new Float32Array(particleCount), 1);
        opacityAttribute.setUsage(THREE.DynamicDrawUsage);
        geometry2.setAttribute('opacity', opacityAttribute);

        // const brokenAttribute = new THREE.InstancedBufferAttribute(new Float32Array(particleCount), 1);
        // brokenAttribute.setUsage(THREE.DynamicDrawUsage);
        // geometry2.setAttribute('broken', brokenAttribute);

        const scales = new Float32Array(particleCount);
        const scaleAttribute = new THREE.InstancedBufferAttribute(scales, 1);
        geometry2.setAttribute('scales', scaleAttribute);

        
    
        return geometry2;
    };

    //##################################################### material #####################################################
    const splashMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: {
                value: 0,
            },
            perlinnoise:{
                value: splashTexture2
            },
            cameraBillboardQuaternion: {
                value: new THREE.Quaternion(),
            },
        },
        vertexShader: `\
            
            ${THREE.ShaderChunk.common}
            ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
        
        
            uniform float uTime;
            uniform vec4 cameraBillboardQuaternion;
    
            varying vec2 vUv;
            varying vec3 vPos;
            //varying float vBroken;
            varying float vOpacity;
            
            attribute vec3 positions;
            attribute float scales;
            attribute vec4 quaternions;
            //attribute float broken;
            attribute float opacity;
            
            vec3 qtransform(vec3 v, vec4 q) { 
              return v + 2.0*cross(cross(v, q.xyz ) + q.w*v, q.xyz);
            }
            vec3 rotateVecQuat(vec3 position, vec4 q) {
                vec3 v = position.xyz;
                return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
            }
        
            void main() {
              
              vOpacity=opacity;
              
              vUv=uv;
              vPos=position;
              vec3 pos = position;
              pos = rotateVecQuat(pos, cameraBillboardQuaternion);
              pos*=scales;
              pos+=positions;
              vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectionPosition = projectionMatrix * viewPosition;
      
              gl_Position = projectionPosition;
              ${THREE.ShaderChunk.logdepthbuf_vertex}
            }
        `,
        fragmentShader: `\
            ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
            uniform float uTime;
            //varying float vBroken;
            varying float vOpacity;
            
            varying vec2 vUv;
            varying vec3 vPos;
            uniform sampler2D perlinnoise;
            
            #define PI 3.1415926
            
            
            
            
            void main() {
                
                
                vec4 ripple = texture2D(
                    perlinnoise,
                    vUv
                );


                gl_FragColor = ripple;
                if(gl_FragColor.a<0.2){
                    discard;
                }
                

                gl_FragColor.a*=vOpacity;
            ${THREE.ShaderChunk.logdepthbuf_fragment}
            }
        `,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        
    });
    
   

    

    //##################################################### object #####################################################
    let mesh=null;
    const addInstancedMesh=()=>{
        const geometry2 = new THREE.PlaneGeometry( 1.5, 1.5 );
        const geometry =_getSplashGeometry(geometry2)
        mesh = new THREE.InstancedMesh(
            geometry,
            splashMaterial,
            particleCount
        );
        
        app.add(mesh);
        
        for (let i = 0; i < particleCount; i++) {
            
            info.velocity[i] = new THREE.Vector3();
            
        }
        
        
    }
    addInstancedMesh();
    

    let timer = 0;
    useFrame(({timestamp}) => {
        
   
       
        
        if (mesh) {
            const opacityAttribute = mesh.geometry.getAttribute('opacity');
            //const brokenAttribute = mesh.geometry.getAttribute('broken');
            // const startTimesAttribute = mesh.geometry.getAttribute('startTimes');
            const positionsAttribute = mesh.geometry.getAttribute('positions');
            const scalesAttribute = mesh.geometry.getAttribute('scales');
            //const quaternionsAttribute = mesh.geometry.getAttribute('quaternions');
            
            for (let i = 0; i < particleCount; i++) {
                mesh.getMatrixAt(i, matrix);
                matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
                
                if(positionsAttribute.getY(i)<0){
                    info.velocity[i].x=(Math.cos(i))*5;
                    info.velocity[i].y=10+(Math.random()-0.5)*10;
                    info.velocity[i].z=(Math.sin(i))*5;
                    
                        
                    info.velocity[i].divideScalar(20);
                    positionsAttribute.setXYZ(i,123.7+(Math.cos(i))*5, 0, -54.5+(Math.sin(i))*5);
                    //brokenAttribute.setX(i, Math.random()*0.3+0.3);
                    opacityAttribute.setX(i, 1);
                    scalesAttribute.setX(i, 0.5 + Math.random()*0.5);
                    

                }

                if(positionsAttribute.getY(i)>=-100){
                    
                      
                    positionsAttribute.setXYZ(  i, 
                                                positionsAttribute.getX(i)+info.velocity[i].x,
                                                positionsAttribute.getY(i)+info.velocity[i].y,
                                                positionsAttribute.getZ(i)+info.velocity[i].z
                                            );
                    scalesAttribute.setX(i, scalesAttribute.getX(i)-0.01);
                    opacityAttribute.setX(i, opacityAttribute.getX(i)-0.005);
                    // if(brokenAttribute.getX(i)<1.0)
                    //     brokenAttribute.setX(i, brokenAttribute.getX(i)+0.008);
                    
                    info.velocity[i].add(acc);
                }
                

            }
            
            mesh.instanceMatrix.needsUpdate = true;
            positionsAttribute.needsUpdate = true;
            opacityAttribute.needsUpdate = true;
            //brokenAttribute.needsUpdate = true;
            scalesAttribute.needsUpdate = true;
            
            //quaternionsAttribute.needsUpdate = true;
            // startTimesAttribute.needsUpdate = true;
            mesh.material.uniforms.uTime.value=timestamp/1000;
            mesh.material.uniforms.cameraBillboardQuaternion.value.copy(camera.quaternion);
            timer++;

        }
        app.updateMatrixWorld();

        
    });
  }


  //####################################################### waterfall #######################################################
  // {
  //   const cylinder = new THREE.CylinderGeometry(3.5, 3.5, 75, 32, 32,true);

  //   const vertexShader = `
  //     ${THREE.ShaderChunk.common}
  //     ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
  //     varying vec2 vUv;
  //     void main() {
  //       vUv = uv;
  //       gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  //       ${THREE.ShaderChunk.logdepthbuf_vertex}
  //     }
  //   `;
  //   const fragmentShader = `
  //     ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
  //     #include <common>

  //     uniform vec3 iResolution;
  //     uniform float iTime;

  //     varying vec2 vUv;

  //     const vec3 white = vec3(0xd1, 0xee, 0xf5) / float(0xff);
  //     const vec3 blue = vec3(0x01, 0x8e, 0xc6) / float(0xff);

 
  //     vec2 hash2( vec2  p ) { p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) ); return fract(sin(p)*43758.5453); }

  //     vec2 voronoi( in vec2 x, float w , float time)
  //     {
  //         vec2 n = floor( x );
  //         vec2 f = fract( x );

  //         vec2 m = vec2(8.0, 0.0);
  //         for( int j=-1; j<=1; j++ )
  //           for( int i=-1; i<=1; i++ )
  //           {
  //               vec2 g = vec2( float(i),float(j) );
  //               vec2 o = hash2( n + g );
  //               o = 0.5 + 0.5*sin( time + 6.2831*o );
  //               float d = length(g - f + o);
  //               float h = smoothstep( 0.0, 1.0, 0.5 + 0.5*(m.x-d)/w );
  //               m.x = mix( m.x,     d, h ) - h*(1.0-h)*w/(1.0+3.0*w); // distance
  //               m.y = mix( m.y, 0.75, h ) - h*(1.0-h)*w/(1.0+3.0*w);
  //           }
       
  //       return m;
  //     }

  //     vec4 get_colorCylinder(vec2 p) {
  //       float d = 0.;
  //       float time = iTime;
  //       p.y += time * 0.51;
  //       p.x = abs(p.x);
  //       p *= 5.;
  //       vec2 td = voronoi(p * vec2(2.5, 1.185), 0.51, time * .1);
  //       p.y += time * 0.51;
  //       vec2 td2 = voronoi(p * vec2(2.5, 1.185), 0.51, (time)*.1);
  //       td *= td2;
  //       d = max((1. - smoothstep(0.476, 0.476 + 0.005, td.y)),
  //               (1. - smoothstep(0.685, 0.685 + 0.005, td2.y)));

  //       return vec4(mix(blue, white, d), 1.);
  //     }

     

  //     void mainImage(out vec4 fragColor, in vec2 fragCoord) {
       
     
  //       vec2 uv = vUv ;
     
  //       //uv.y *= iResolution.y / iResolution.x;
       
  //       fragColor = get_colorCylinder(vUv);
  //     }


  //     void main() {
  //       mainImage(gl_FragColor, vUv * iResolution.xy);
  //       gl_FragColor.r+=0.1;
  //       gl_FragColor.g+=0.2;
  //       gl_FragColor.b+=0.1;
  //       gl_FragColor.a-=0.2;
  //       ${THREE.ShaderChunk.logdepthbuf_fragment}
  //     }
  //   `;

  //   const uniforms = {
  //     iTime: { value: 0 },
  //     iResolution: { value: new THREE.Vector3() }
  //   };
  //   const material = new THREE.ShaderMaterial({
  //     vertexShader,
  //     fragmentShader,
  //     uniforms,
  //     transparent: true

  //   });
  //   material.side = THREE.DoubleSide;

  //   //const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  //   const waterfall = new THREE.Mesh(cylinder, material);
  //   //waterfall.position.y=100;
  //   waterfall.scale.x /= 1.1;
  //   waterfall.position.set(110.7, 38, -56.5);

  //   //waterfall.rotation.y=Math.PI/2;
  //   app.add(waterfall);

  //   app.updateMatrixWorld();
  //   //uniforms.iResolution.value.set(window.innerWidth/10000, window.innerHeight/10000, 1);
  //   //uniforms.iResolution.value.set(1,1, 1);
  //   useFrame(({ timestamp, timeDiff }) => {
  //     uniforms.iTime.value = timestamp / 1000;
  //     uniforms.iResolution.value.set(window.innerWidth / 10000, window.innerHeight / 10000, 1);

  //   });

  // }
  // //############################################# splash  #################################################
  //   const cloud = textureLoader.load(`${baseUrl}/textures/cloud8.png`)
  
  //   {
  //       const particlesGeometry = new THREE.BufferGeometry()
  //       const count = 20;

  //       const positions = new Float32Array(count * 3)

  //       for(let i = 0; i < count; i++) 
  //       {
  //           positions[i * 3 + 0] = (Math.cos(i)) * 5;
  //           positions[i * 3 + 1] = (Math.random()-0.5)*4;
  //           positions[i * 3 + 2] = (Math.sin(i)) * 5;

  //       }
  //       particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  //       const scaleArray = new Float32Array(count)

  //       for(let i = 0; i < count; i++)
  //       {
  //           scaleArray[i] = Math.random()
  //       }
  //       particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

  //       const rotation = new Float32Array(count)

  //       for(let i = 0; i < count; i++)
  //       {
  //           rotation[i] = Math.random()*90;
  //       }
  //       particlesGeometry.setAttribute('aRotation', new THREE.BufferAttribute(rotation, 1))

  //       const material = new THREE.PointsMaterial({
  //           size: 1,
  //           sizeAttenuation: true,
  //           transparent:true,
            
  //       })
        
  //       material.transparent= true; 
  //       //material.map= texture; 
  //       material.side= THREE.DoubleSide; 
  //       material.depthWrite= false;
        

  //       const particlesMaterial = new THREE.ShaderMaterial({
  //           uniforms: {
  //               uColor: {
  //                   value: 0,
  //               },
  //               uTime: {
  //                   value: 0,
  //               },
  //               uPixelRatio: { 
  //                   value: Math.min(window.devicePixelRatio, 2) 
  //               },
  //               uSize: { 
  //                   value: 70 
  //               },
  //               uTexture: { 
  //                   value: cloud 
  //               },
  //               uAvatarPos:{
  //                   value: new THREE.Vector3(0,0,0)
  //               },
  //               // uAvatarDirection:{
  //               //     value: new THREE.Vector3(0,0,0)
  //               // }

  //           },
  //           vertexShader: `\
                
  //               ${THREE.ShaderChunk.common}
  //               ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
                
            
  //               uniform float uTime;
  //               uniform float uPixelRatio;
  //               uniform float uSize;
  //               //uniform vec3 uAvatarPos;
  //               // uniform vec3 uAvatarDirection;
  //               attribute float aScale;
  //               attribute float aRotation;
                

  //               varying vec2 vUv;
  //               varying float vRotation;
  //               varying vec3 vPos;
                
  //               void main() { 
  //               gl_PointSize = 8000.;
  //               vUv=uv;
  //               vRotation=aRotation;


  //               vec3 pos=position;
  //               // if(gl_VertexID > 1){  
  //               //     pos.x += sin( float(gl_InstanceID) + (uTime * 0.8) ) * 0.2;
  //               // }
  //               vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  //               float totalY = 5. - 0.5;
  //               modelPosition.y = 5. - mod(5. - (modelPosition.y + uTime * 50.*aScale), totalY);
                
                
  //               vPos=modelPosition.xyz;
  //               gl_PointSize*=modelPosition.y;
  //               vec4 viewPosition = viewMatrix * modelPosition;
  //               vec4 projectionPosition = projectionMatrix * viewPosition;
  //               gl_Position = projectionPosition;

  //               vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  //               bool isPerspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 );
  //                   if ( isPerspective ) gl_PointSize *= (1.0 / - viewPosition.z);

        
                
                
                
  //               ${THREE.ShaderChunk.logdepthbuf_vertex}
  //               }
  //           `,
  //           fragmentShader: `\
                
                
  //               ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
  //               varying vec2 vUv;
  //               varying float vRotation;
  //               varying vec3 vPos;
  //               uniform sampler2D uTexture;
  //               uniform float uTime;
                
                
  //               void main() {
  //               float vr=vRotation*(uTime*.5);
  //               float mid = 0.5;
  //               vec2 rotated = vec2(cos(vr) * (gl_PointCoord.x - mid) - sin(vr) * (gl_PointCoord.y - mid) + mid,
  //                           cos(vr) * (gl_PointCoord.y - mid) + sin(vr) * (gl_PointCoord.x - mid) + mid);
                
  //               // vec4 rotatedTexture = texture2D( texture,  rotated);
  //               // gl_FragColor = vec4( color * vColor, 1.0 ) * rotatedTexture;
                
  //               vec4 textureColor = texture2D(uTexture, rotated );
  //               textureColor.xyz/=2.0;
  //               textureColor.y+=0.3;
  //               if( textureColor.a < 0.8  )
  //               {
  //                   discard;    
  //               }       
                
  //               gl_FragColor = textureColor;
  //               gl_FragColor.g-=0.2;
                
  //               gl_FragColor.a=(5.- vPos.y)/5.;
  //               gl_FragColor.a*=0.01;
  //               // float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  //               // float strength = 0.05 / distanceToCenter - 0.1;
  //               // gl_FragColor = vec4(0.260, 0.918, 0.115, strength);
  //               ${THREE.ShaderChunk.logdepthbuf_fragment}
  //               }
  //           `,
  //           side: THREE.DoubleSide,
  //           transparent: true,
  //           depthWrite: false,
  //           blending: THREE.AdditiveBlending,
            
  //       });
        

  //       const fallingLeave = new THREE.Points(particlesGeometry, particlesMaterial);
  //       fallingLeave.position.x=123.7;
  //       fallingLeave.position.y=0;
  //       fallingLeave.position.z=-54.5;
        
  //       app.add(fallingLeave);

  //       // const group = new THREE.Group();
  //       // group.add(fallingLeave);
  //       // app.add(group);
  //       app.updateMatrixWorld();
  //       // let userFollow=0;
  //       // let dum = new THREE.Vector3();
  //       useFrame(({timestamp}) => {
            
  //           // localPlayer.getWorldDirection(dum)
  //           // dum = dum.normalize();
        
  //           fallingLeave.material.uniforms.uTime.value = (timestamp)/50000;
  //           //fallingLeave.material.uniforms.uAvatarPos.value=localPlayer.position;
  //           // fallingLeave.material.uniforms.uAvatarDirection.value.x=localPlayer.position.x+5*dum.x;
  //           // fallingLeave.material.uniforms.uAvatarDirection.value.z=localPlayer.position.z+5*dum.z;
  //           //if(userFollow%1000===0){
  //               // fallingLeave.position.x=localPlayer.position.x;
  //               // fallingLeave.position.z=localPlayer.position.z;
  //           //}
  //           // group.position.x=localPlayer.position.x;
  //           // group.position.y=localPlayer.position.y;
  //           // group.position.z=localPlayer.position.z;
  //           // group.rotation.copy(localPlayer.rotation);

  //           // group.updateMatrixWorld();
  //           //userFollow++;
            
        
  //       });
  //     }
  //     //############################################# splash particle #################################################
  //     {

  //       const splashtexture = textureLoader.load(`${baseUrl}/textures/splash.png`)
  //       const particleCount = 10;
  //       let info = {
  //           velocity: [particleCount],
  //           rotate: [particleCount]
  //       }
  //       const acc = new THREE.Vector3(0, -0.002, 0);
    
  //       //######## object #########
  //       let mesh = null;
  //       let dummy = new THREE.Object3D();
    
    
  //       function addInstancedMesh() {
  //           mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({map:splashtexture, color: 0xF7D994, transparent:true, opacity:1, depthWrite:false, blending:THREE.AdditiveBlending}), particleCount);
            
  //           app.add(mesh);
  //           setInstancedMeshPositions(mesh);
  //       }
  //       function setInstancedMeshPositions(mesh1) {
  //           for (let i = 0; i < mesh1.count; i++) {
  //               info.velocity[i] = (new THREE.Vector3(
  //                   (Math.random() - 0.5)*3.,
  //                   Math.random() * 1.,
  //                   (Math.random() - 0.5)*3.));
  //               info.velocity[i].divideScalar(20);
  //               info.rotate[i] = new THREE.Vector3(
  //                   Math.random() - 0.5,
  //                   Math.random() - 0.5,
  //                   Math.random() - 0.5);
  //               dummy.position.set(110.7,0,-56.5);
  //               dummy.updateMatrix();
  //               mesh1.setMatrixAt(i, dummy.matrix);
  //           }
  //           mesh1.instanceMatrix.needsUpdate = true;
  //       }
  //       addInstancedMesh();
    
  //       let matrix = new THREE.Matrix4();
  //       let position = new THREE.Vector3();
    
  //       useFrame(({timestamp}) => {
        
  //         if (mesh) {
  //           for (let i = 0; i < particleCount; i++) {
  //               mesh.getMatrixAt(i, matrix);
    
    
  //               position.setFromMatrixPosition(matrix); // extract position form transformationmatrix
    
               
  //               matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
                
  //               // dummy.rotation.x += timestamp * (i % 2 == 0 ? -1 : 1);
  //               // dummy.scale.y = 0.1;
    
  //               if (dummy.position.y < 0 || dummy.position.y > 10) {
  //                   let rand=Math.random();
  //                   dummy.scale.x = rand;
  //                   dummy.scale.y = rand;
  //                   dummy.scale.z = rand;
                    
  //                   dummy.position.x = 123.7;
  //                   dummy.position.y = 0;
  //                   dummy.position.z = -54.5;
  //                   info.velocity[i].x = (Math.random() - 0.5)*5;
  //                   info.velocity[i].y = Math.random() *4;
  //                   info.velocity[i].z = (Math.random() - 0.5)*5.;
  //                   info.velocity[i].divideScalar(20);
  //               }
  //               info.velocity[i].add(acc);
  //               dummy.scale.x /=1.01;
  //               dummy.scale.y /=1.01;
  //               dummy.scale.z /=1.01;
  //               dummy.position.add(info.velocity[i]);

  //               dummy.rotation.copy(camera.rotation);
                

  //               dummy.updateMatrix();
                
  //               mesh.setMatrixAt(i, dummy.matrix);
  //               mesh.instanceMatrix.needsUpdate = true;
    
  //           }
    
    
  //       }
        
  //       });
  //     }

  //############################################# fire  #################################################
  const fireTexture = textureLoader.load(`${baseUrl}/textures/fire3.png`)
  {
      const particlesGeometry = new THREE.BufferGeometry()
      const count = 300;

      const positions = new Float32Array(count * 3)

      for(let i = 0; i < count; i++) 
      {
          positions[i * 3 + 0] = (Math.random()-0.5)*0.35;
          positions[i * 3 + 1] = (Math.random()-0.5)*1;
          positions[i * 3 + 2] = (Math.random()-0.5)*0.35;

      }
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      const scaleArray = new Float32Array(count)

      for(let i = 0; i < count; i++)
      {
          scaleArray[i] = Math.random()
      }
      particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

      const rotation = new Float32Array(count)

      for(let i = 0; i < count; i++)
      {
          rotation[i] = Math.random()*90;
      }
      particlesGeometry.setAttribute('aRotation', new THREE.BufferAttribute(rotation, 1))

      const material = new THREE.PointsMaterial({
          size: 1,
          sizeAttenuation: true,
          transparent:true,
          
      })
      
      material.transparent= true; 
      //material.map= texture; 
      material.side= THREE.DoubleSide; 
      material.depthWrite= false;
      

      const particlesMaterial = new THREE.ShaderMaterial({
          uniforms: {
              uColor: {
                  value: 0,
              },
              uTime: {
                  value: 0,
              },
              uPixelRatio: { 
                  value: Math.min(window.devicePixelRatio, 2) 
              },
              uSize: { 
                  value: 70 
              },
              uTexture: { 
                  value: fireTexture 
              },
              // uAvatarPos:{
              //     value: new THREE.Vector3(0,0,0)
              // },
              // uAvatarDirection:{
              //     value: new THREE.Vector3(0,0,0)
              // }

          },
          vertexShader: `\
              
              ${THREE.ShaderChunk.common}
              ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
              
          
              uniform float uTime;
              uniform float uPixelRatio;
              uniform float uSize;
              uniform vec3 uAvatarPos;
              //uniform vec3 uAvatarDirection;
              attribute float aScale;
              attribute float aRotation;
              

              varying vec2 vUv;
              varying float vRotation;
              varying vec3 vPos;
              
              void main() { 
              gl_PointSize = 400.*aScale;
              vUv=uv;
              vRotation=aRotation;


              vec3 pos=position;
              
              vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
              float totalY = 102. - 101.;
              modelPosition.y = 102. - mod(102. - (modelPosition.y + uTime * 50.), totalY);
              
              vPos=modelPosition.xyz;
              gl_PointSize*=0.2+(102.-modelPosition.y);
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectionPosition = projectionMatrix * viewPosition;
              gl_Position = projectionPosition;

              vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
              bool isPerspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 );
                  if ( isPerspective ) gl_PointSize *= (1.0 / - viewPosition.z);

      
              
              
              
              ${THREE.ShaderChunk.logdepthbuf_vertex}
              }
          `,
          fragmentShader: `\
              
              
              ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
              varying vec2 vUv;
              varying float vRotation;
              varying vec3 vPos;
              uniform sampler2D uTexture;
              uniform float uTime;
              
              
              void main() {
              float vr=vRotation*(uTime*.5);
              float mid = 0.5;
              vec2 rotated = vec2(cos(vr) * (gl_PointCoord.x - mid) - sin(vr) * (gl_PointCoord.y - mid) + mid,
                          cos(vr) * (gl_PointCoord.y - mid) + sin(vr) * (gl_PointCoord.x - mid) + mid);
              
              // vec4 rotatedTexture = texture2D( texture,  rotated);
              // gl_FragColor = vec4( color * vColor, 1.0 ) * rotatedTexture;
              
              vec4 textureColor = texture2D(uTexture, rotated );
              // textureColor.xyz/=2.0;
              // textureColor.y+=0.3;
              if( textureColor.a < 0.1  )
              {
                  discard;    
              }       
              
              gl_FragColor = textureColor;
              //gl_FragColor.g-=0.2;
              
              gl_FragColor.a=(102.- vPos.y);
              //gl_FragColor.a*=0.2;
              // float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
              // float strength = 0.05 / distanceToCenter - 0.1;
              // gl_FragColor = vec4(0.260, 0.918, 0.115, strength);
              ${THREE.ShaderChunk.logdepthbuf_fragment}
              }
          `,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          
      });
      

      const fallingLeave = new THREE.Points(particlesGeometry, particlesMaterial);
      fallingLeave.position.set(-75.7, 101., 40.);
      
      app.add(fallingLeave);

      // const group = new THREE.Group();
      // group.add(fallingLeave);
      // app.add(group);
      app.updateMatrixWorld();
      //let userFollow=0;
      //let dum = new THREE.Vector3();
      useFrame(({timestamp}) => {
          
          // localPlayer.getWorldDirection(dum)
          // dum = dum.normalize();
      
          fallingLeave.material.uniforms.uTime.value = (timestamp)/50000;
          //fallingLeave.material.uniforms.uAvatarPos.value=localPlayer.position;
          // fallingLeave.material.uniforms.uAvatarDirection.value.x=localPlayer.position.x+5*dum.x;
          // fallingLeave.material.uniforms.uAvatarDirection.value.z=localPlayer.position.z+5*dum.z;
          //if(userFollow%1000===0){
              // fallingLeave.position.x=localPlayer.position.x;
              // fallingLeave.position.z=localPlayer.position.z;
          //}
          // group.position.x=localPlayer.position.x;
          // group.position.y=localPlayer.position.y;
          // group.position.z=localPlayer.position.z;
          // group.rotation.copy(localPlayer.rotation);

          // group.updateMatrixWorld();
          //userFollow++;
          
      
      });
    }
  //####################################################### fire particle ##########################################################
  {
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 40;

    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = Math.random() * 1;
      positions[i * 3 + 1] = Math.random() * 2;
      positions[i * 3 + 2] = Math.random() * 1;

    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const scaleArray = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      scaleArray[i] = Math.random()
    }
    particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))


    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: {
          value: 0,
        },
        uTime: {
          value: 0,
        },
        uPixelRatio: {
          value: Math.min(window.devicePixelRatio, 2)
        },
        uSize: {
          value: 200
        }
      },
      vertexShader: `\
           
          ${THREE.ShaderChunk.common}
          ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
         
       
          uniform float uTime;
          uniform float uPixelRatio;
          uniform float uSize;
          attribute float aScale;
         
          void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
           
            float totalY = 102. - 100.;
            modelPosition.y = 102. - mod(102. - (modelPosition.y + uTime * 80.), totalY);
            modelPosition.x += sin(uTime/100. + modelPosition.y * 10.0+modelPosition.z*10.) * aScale * 0.1;
            modelPosition.z += sin(uTime/100. + modelPosition.x * 10.0+modelPosition.y*10.) * aScale * 0.1;
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectionPosition = projectionMatrix * viewPosition;
 
            gl_Position = projectionPosition;
            gl_PointSize = uSize * aScale * uPixelRatio;
            gl_PointSize *= (1.0 / - viewPosition.z);
            ${THREE.ShaderChunk.logdepthbuf_vertex}
          }
        `,
      fragmentShader: `\
         
         
          ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
         
         
         
          void main() {
           
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 0.05 / distanceToCenter - 0.5;
            gl_FragColor = vec4(0.940, 0.241, 0.0282, strength);
            ${THREE.ShaderChunk.logdepthbuf_fragment}
          }
        `,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });


    const fireflies = new THREE.Points(particlesGeometry, particlesMaterial);
    fireflies.position.set(-76.1, 102., 39.5);
    app.add(fireflies);
    app.updateMatrixWorld();

    useFrame(({ timestamp }) => {

      fireflies.material.uniforms.uTime.value = (timestamp) / 50000;
      // fireflies.position.copy(localPlayer.position);
      // fireflies.position.z-=50;
      // fireflies.position.y-=3;
      fireflies.updateMatrixWorld();
      //console.log(particles.position);

    });
  }

  



  app.setComponent('renderPriority', 'low');

  return app;
};