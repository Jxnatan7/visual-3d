import React, { Suspense, useEffect, useRef, useState } from "react";
import { PanResponder, StyleSheet, View } from "react-native";
import { Canvas, useThree } from "@react-three/fiber/native";
import { Center, Environment } from "@react-three/drei/native";

type SceneProps = {
  children: React.ReactNode;
  initialRotation?: [number, number];
  rotationSensitivity?: number;
};

export const Scene = ({
  children,
  initialRotation = [0, 0],
  rotationSensitivity = 0.005,
}: SceneProps) => {
  const [rotation, setRotation] = useState<[number, number]>(initialRotation);
  const lastPan = useRef<{ x: number; y: number } | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, state) => {
        lastPan.current = { x: state.x0, y: state.y0 };
      },
      onPanResponderMove: (evt, state) => {
        if (!lastPan.current) return;
        const dx = state.moveX - lastPan.current.x;
        const dy = state.moveY - lastPan.current.y;

        setRotation(([rx, ry]) => [
          rx + dy * rotationSensitivity,
          ry + dx * rotationSensitivity,
        ]);

        lastPan.current = { x: state.moveX, y: state.moveY };
      },
      onPanResponderRelease: () => {
        lastPan.current = null;
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <Canvas
        frameloop="always"
        style={styles.canvas}
        gl={{
          toneMappingExposure: 1.5,
          outputColorSpace: "srgb",
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={3} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <RotatingGroup rotation={rotation}>
            <Center>{children}</Center>
          </RotatingGroup>
        </Suspense>
      </Canvas>

      <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
    </View>
  );
};

function RotatingGroup({ rotation, children }: any) {
  const ref = useRef<any>(null);
  const { invalidate } = useThree();

  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.x = rotation[0];
      ref.current.rotation.y = rotation[1];
      invalidate();
    }
  }, [rotation, invalidate]);

  return <group ref={ref}>{children}</group>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  canvas: { flex: 1 },
});

export default Scene;
