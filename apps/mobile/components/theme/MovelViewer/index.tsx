import { Box } from "@/components/restyle";
import { useViewerController } from "../useViewerController";
import { Canvas } from "@react-three/fiber/native";
import { Suspense } from "react";
import { Center, Environment } from "@react-three/drei/native";
import { InteractiveStage } from "../InteractiveStage";
import { StyleSheet } from "react-native";
import { DirectionalPad } from "../ControlButton";

export type ModelViewerProps = {
  children: React.ReactNode;
  initialRotation?: [number, number];
  autoRotate?: boolean;
  showControls?: boolean;
  backgroundColor?: string;
};

export const ModelViewer = ({
  children,
  initialRotation = [0, 0],
  autoRotate = true,
  showControls = true,
  backgroundColor = "#111",
}: ModelViewerProps) => {
  const controller = useViewerController({ initialRotation, autoRotate });

  return (
    <Box style={[styles.container, { backgroundColor }]}>
      <Canvas
        frameloop="always"
        style={styles.canvas}
        gl={{
          toneMappingExposure: 1.5,
          outputColorSpace: "srgb",
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={3} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <InteractiveStage controller={controller}>
            <Center>{children}</Center>
          </InteractiveStage>
        </Suspense>
      </Canvas>

      <Box
        style={StyleSheet.absoluteFill}
        {...controller.panResponder.panHandlers}
        pointerEvents="auto"
      />

      {showControls && <DirectionalPad controller={controller} />}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  canvas: { flex: 1 },
});
