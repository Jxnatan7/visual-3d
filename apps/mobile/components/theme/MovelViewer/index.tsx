import React, { Suspense } from "react";
import { StyleSheet } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import { Center, Environment } from "@react-three/drei/native";
import { Box } from "@/components/restyle";
import { useViewerController } from "../useViewerController";
import { InteractiveStage } from "../InteractiveStage";
import Button from "../Button";
import * as MediaLibrary from "expo-media-library";
import { GifRecorder } from "../GifRecorder";
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
  alpha: true,
  preserveDrawingBuffer: true,
} as const;

export const ModelViewer = ({
  children,
  initialRotation = [0, 0],
  autoRotate = true,
  showControls = true,
  backgroundColor = "#121212",
}: ModelViewerProps) => {
  const controller = useViewerController({ initialRotation, autoRotate });
  const [isRecording, setIsRecording] = React.useState(false);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const handleRecord = async () => {
    if (status?.status !== "granted") {
      await requestPermission();
    }
    setIsRecording(true);
  };

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
          <GifRecorder
            recording={isRecording}
            onFinished={() => setIsRecording(false)}
          />
        </Suspense>
      </Canvas>

      <Box position="absolute" top={100} alignSelf="center" zIndex={10}>
        <Button
          text={isRecording ? "Recording..." : "Create GIF"}
          onPress={handleRecord}
          disabled={isRecording}
        />
      </Box>

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
