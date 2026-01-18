import React, { Suspense } from "react";
import { StyleSheet } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import { Center, Environment } from "@react-three/drei/native";
import { Box } from "@/components/restyle";

import { useViewerController } from "../useViewerController";
import { InteractiveStage } from "../InteractiveStage";
import { DirectionalPad } from "../ControlButton";

export type ModelViewerProps = {
  children: React.ReactNode;
  initialRotation?: [number, number];
  autoRotate?: boolean;
  showControls?: boolean;
  backgroundColor?: string;
};

const GL_CONFIG = {
  powerPreference: "high-performance",
  antialias: false,
  stencil: false,
  depth: true,
  alpha: false,
} as const;

export const ModelViewer = ({
  children,
  initialRotation = [0, 0],
  autoRotate = true,
  showControls = true,
  backgroundColor = "#F2F2F2",
}: ModelViewerProps) => {
  const controller = useViewerController({ initialRotation, autoRotate });

  return (
    <Box style={[styles.container, { backgroundColor }]}>
      <Canvas
        frameloop="always"
        style={styles.canvas}
        gl={GL_CONFIG}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <InteractiveStage controller={controller}>
            <Center>{children}</Center>
          </InteractiveStage>
        </Suspense>
      </Canvas>

      <Box
        pointerEvents="auto"
        style={StyleSheet.absoluteFill}
        {...controller.panResponder.panHandlers}
      />

      {showControls && <DirectionalPad controller={controller} />}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  canvas: { flex: 1 },
});
