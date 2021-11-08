import "./App.css";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene/Scene";
const App = () => {
  return (
    <Canvas
      colorManagement
      camera={{ position: [8, 8, -8], fov: 45 }}
      dpr={Math.max(window.devicePixelRatio, 2)}
      gl={{
        antialias: true,
        alpha: false,
        shadowMap: true,
      }}
    >
      <Scene />
    </Canvas>
  );
};

export default App;
