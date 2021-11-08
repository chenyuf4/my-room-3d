import { Suspense, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import RoomGlb from "../../complex-room-28.glb";
import RoomImg from "../../complex-room-27.jpg";
import { useState, useEffect } from "react";
import wallpaper from "../../wallpaper.jpg";
import code from "../../code.png";
import animateMov from "../../animateVideo.mp4";
import transformerMov from "../../movieVideo.mp4";
import { shaders } from "../../shader/shader";
import gsap from "gsap";

const Model = () => {
  const [bakedTexture, imgTexture, codeImgTexture] = useTexture([
    RoomImg,
    wallpaper,
    code,
  ]);
  const [initialLoading, setInitialLoading] = useState(false);
  const { nodes } = useGLTF(RoomGlb);
  const specialKeyArr = [
    "Scene",
    "Lamp_Emission",
    "Monitor_Emission",
    "Ipad_Pro_Emission",
    "Macbook_Pro_Emission",
    "TV_Screen",
  ];

  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = animateMov;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = "muted";
    vid.playsInline = true;
    vid.autoplay = true;
    return vid;
  });

  const [movie] = useState(() => {
    const vid = document.createElement("video");
    vid.src = transformerMov;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = "muted";
    vid.playsInline = true;
    vid.autoplay = true;
    return vid;
  });

  useEffect(() => {
    video.play();
  }, [video]);

  useEffect(() => {
    movie.play();
  }, [movie]);

  const loadingElement = document.querySelector(".loading-bar");
  useEffect(() => {
    let gsapTimeline = gsap.timeline();
    if (!initialLoading) {
      gsapTimeline
        .set(ref.current.uniforms.uAlpha, { value: 1 })
        .set(loadingElement, { transformOrigin: "top left" })
        .fromTo(
          loadingElement,
          { scaleX: 0.1 },
          { scaleX: 0.99, duration: 1.5 }
        )
        .to(loadingElement, {
          scaleX: 0,
          duration: 0.8,
          transformOrigin: "100% 0",
          delay: 0.3,
        })
        .to(ref.current.uniforms.uAlpha, {
          duration: 0.8,
          value: 0,
          delay: 0.2,
        });
      setInitialLoading(true);
    }
  });

  const ref = useRef();

  return (
    <group dispose={null}>
      {Object.keys(nodes)
        .filter((key) => !specialKeyArr.includes(key))
        .map((key, index) => {
          const node = nodes[key];
          return (
            <mesh
              geometry={node.geometry}
              key={index}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
            >
              <meshBasicMaterial map={bakedTexture} map-flipY={false} />
            </mesh>
          );
        })}
      <mesh
        geometry={nodes.Lamp_Emission.geometry}
        position={nodes.Lamp_Emission.position}
        rotation={nodes.Lamp_Emission.rotation}
        scale={nodes.Lamp_Emission.scale}
        material-color="#ffffff"
      />
      <mesh
        position={[
          nodes.Monitor_Emission.position.x,
          nodes.Monitor_Emission.position.y,
          nodes.Monitor_Emission.position.z - 0.035,
        ]}
        rotation={[0, Math.PI, 0]}
        scale={[0.97, 0.97, 0.97]}
      >
        <planeGeometry args={[1.724, 0.989]} />
        <meshBasicMaterial side={THREE.DoubleSide}>
          <videoTexture attach="map" args={[video]} />
        </meshBasicMaterial>
      </mesh>

      <mesh
        position={[
          nodes.TV_Screen.position.x - 1.235,
          nodes.TV_Screen.position.y - 0.23,
          nodes.TV_Screen.position.z,
        ]}
        rotation={[0, Math.PI / 2, 0]}
        scale={nodes.TV_Screen.scale}
      >
        <planeGeometry args={[2.84, 1.651]} />
        <meshBasicMaterial side={THREE.DoubleSide}>
          <videoTexture attach="map" args={[movie]} />
        </meshBasicMaterial>
      </mesh>

      <mesh
        position={nodes.Macbook_Pro_Emission.position}
        rotation={[
          (Math.PI * 20) / 180,
          -(Math.PI * 166) / 180,
          (Math.PI * 5) / 180,
        ]}
        scale={nodes.Macbook_Pro_Emission.scale}
      >
        <planeGeometry args={[0.811, 0.547]} />
        <meshBasicMaterial side={THREE.DoubleSide} map={codeImgTexture} />
      </mesh>

      <mesh
        position={nodes.Ipad_Pro_Emission.position}
        rotation={[Math.PI / 2, 0, (-Math.PI * 2) / 9]}
        scale={nodes.Ipad_Pro_Emission.scale}
      >
        <planeBufferGeometry args={[0.616, 0.473]} />
        <meshBasicMaterial side={THREE.DoubleSide} map={imgTexture} />
      </mesh>

      <mesh>
        <planeBufferGeometry args={[2, 2, 1, 1]} />
        <shaderMaterial
          ref={ref}
          attach="material"
          transparent={true}
          uniforms={shaders.uniforms}
          vertexShader={shaders.vertexShader}
          fragmentShader={shaders.fragmentShader}
        />
      </mesh>
    </group>
  );
};

const Scene = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const ref = useRef();
  return (
    <Suspense fallback={null}>
      <color attach="background" args={["#000000"]} />
      <Model />
      <OrbitControls
        enableZoom={false}
        maxAzimuthAngle={Math.PI}
        maxPolarAngle={(Math.PI * 3) / 7}
        minAzimuthAngle={Math.PI / 2}
        minPolarAngle={0}
        enablePan={false}
        enableDamping={true}
      />
      {/* <mesh>
        <planeBufferGeometry args={[2, 2, 1, 1]} />
        <shaderMaterial
          ref={ref}
          attach="material"
          transparent={true}
          uniforms={shaders.uniforms}
          vertexShader={shaders.vertexShader}
          fragmentShader={shaders.fragmentShader}
        />
      </mesh>
      <Loader materialRef={ref.cu} /> */}
    </Suspense>
  );
};

export default Scene;
