"use client";

import { Environment, Gltf, OrbitControls, Plane } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import "./styles.css"; // Import a CSS file for styling

export const Experience = () => {
  // Define the environment presets and corresponding light settings
  const environmentPresets = [
    { preset: "sunset", lightColor: "orange", lightIntensity: 0.3, bgColor: "#ffcc99" },
    { preset: "dawn", lightColor: "lightblue", lightIntensity: 0.4, bgColor: "#ccffff" },
    { preset: "night", lightColor: "darkblue", lightIntensity: 0.2, bgColor: "#001f3f" },
    { preset: "forest", lightColor: "green", lightIntensity: 0.3, bgColor: "#ccffcc" },
    { preset: "city", lightColor: "yellow", lightIntensity: 0.35, bgColor: "#ffff99" },
    { preset: "park", lightColor: "lightgreen", lightIntensity: 0.25, bgColor: "#b3ffb3" },
    { preset: "studio", lightColor: "white", lightIntensity: 0.5, bgColor: "#f2f2f2" },
    { preset: "warehouse", lightColor: "gray", lightIntensity: 0.3, bgColor: "#e6e6e6" },
    { preset: "apartment", lightColor: "lightyellow", lightIntensity: 0.4, bgColor: "#ffffcc" },
    { preset: "lobby", lightColor: "gold", lightIntensity: 0.35, bgColor: "#ffdb4d" },
  ];

  const [currentPresetIndex, setCurrentPresetIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(5);

  useEffect(() => {
    // Cycle through the environment presets every 2 seconds
    const interval = setInterval(() => {
      setCurrentPresetIndex((prevIndex) => (prevIndex + 1) % environmentPresets.length);
    }, 2000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const currentEnvironment = environmentPresets[currentPresetIndex];

  // Event handlers for buttons
  const handleAnimationToggle = () => setIsAnimating((prev) => !prev);
  const handleRotationToggle = () => setIsRotating((prev) => !prev);
  const handleZoomIn = () => setZoomLevel((prev) => Math.max(prev - 1, 2.5)); // Limit minimum zoom
  const handleZoomOut = () => setZoomLevel((prev) => Math.min(prev + 1, 7)); // Limit maximum zoom

  return (
    <div
      className="experience-container"
      style={{ backgroundColor: currentEnvironment.bgColor }}
    >
      <div className="controls">
        <button onClick={handleAnimationToggle}>
          {isAnimating ? "Stop Animation" : "Start Animation"}
        </button>
        <button onClick={handleRotationToggle}>
          {isRotating ? "Stop Rotation" : "Start Rotation"}
        </button>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
      <Canvas
        camera={{
          position: [0, 0, zoomLevel], // Use dynamic zoom level
          fov: 50, // Optional: Adjust field of view if necessary
        }}
      >
        <CameraManager isRotating={isRotating} />
        <Environment preset={currentEnvironment.preset} />
        <ambientLight
          intensity={currentEnvironment.lightIntensity}
          color={currentEnvironment.lightColor}
        />

        {/* Animate the model using a custom component */}
        <AnimatedModel isAnimating={isAnimating} />

        {/* Make the plane large enough to cover the entire screen */}
        <Plane
          args={[100, 100]} // Increase the size of the plane
          position={[0, -1.1, 0]} // Slightly below the model to act as ground
          rotation={[-Math.PI / 2, 0, 0]} // Rotate to be flat on the ground
        >
          <meshStandardMaterial attach="material" color="gray" /> {/* Color or texture for the ground */}
        </Plane>
      </Canvas>
    </div>
  );
};

const CameraManager = ({ isRotating }) => {
  const orbitControlsRef = useRef();

  useEffect(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = isRotating; // Enable or disable rotation
    }
  }, [isRotating]);

  return (
    <OrbitControls
      ref={orbitControlsRef}
      enableZoom={true} // Enable zooming
      maxDistance={7} // Set maximum zoom-out distance to prevent the camera from going too far
      minDistance={2.5} // Set minimum zoom-in distance to prevent the camera from going inside the model
      enableRotate={true} // Enable rotation
      enablePan={false} // Disable panning
      maxPolarAngle={Math.PI / 2} // Limit vertical rotation to 90 degrees (Y-axis rotation)
      minPolarAngle={0} // Limit vertical rotation to prevent flipping (Z-axis rotation)
      enableDamping={true} // Enable smooth damping
      dampingFactor={0.1} // Damping factor for smoother motion
      autoRotate={false} // Disable auto-rotate for manual control
      rotateSpeed={0.5} // Set rotation speed
    />
  );
};

const AnimatedModel = ({ isAnimating }) => {
  const modelRef = useRef();

  useFrame((state, delta) => {
    if (modelRef.current && isAnimating) {
      // Rotate the model around the Y axis when animation is enabled
      modelRef.current.rotation.y += delta * 0.5; // Rotate Y axis
    }
  });

  return (
    <Gltf
      ref={modelRef}
      src="/models/toyta_supra_2020.glb"
      position={[0, -1, 0]} // Move the model down by 1 unit
    />
  );
};
