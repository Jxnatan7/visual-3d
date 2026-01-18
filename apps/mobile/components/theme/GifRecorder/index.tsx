import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber/native";
import { ExpoWebGLRenderingContext } from "expo-gl";
// @ts-ignore - gif-encoder-2 doesn't have types
import GIFEncoder from "gif-encoder-2";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Alert, Platform } from "react-native";

global.Buffer = global.Buffer || Buffer;

export const GifRecorder = ({
  recording,
  onFinished,
}: {
  recording: boolean;
  onFinished: () => void;
}) => {
  const { gl } = useThree();

  const MAX_FRAMES = 60;
  const FRAME_SKIP = 10;

  const framesRef = useRef<Uint8ClampedArray[]>([]);
  const isFinished = useRef(false);
  const frameCounter = useRef(0);

  useFrame((state) => {
    const { gl, scene, camera } = state;

    gl.render(scene, camera);

    if (recording && framesRef.current.length < MAX_FRAMES) {
      frameCounter.current++;

      if (frameCounter.current % FRAME_SKIP !== 0) return;

      const expoContext = gl.getContext() as ExpoWebGLRenderingContext;
      const width = expoContext.drawingBufferWidth;
      const height = expoContext.drawingBufferHeight;

      const pixels = new Uint8Array(width * height * 4);

      expoContext.readPixels(
        0,
        0,
        width,
        height,
        expoContext.RGBA,
        expoContext.UNSIGNED_BYTE,
        pixels,
      );

      const flippedPixels = flipPixels(pixels, width, height);
      framesRef.current.push(new Uint8ClampedArray(flippedPixels));
    } else if (
      recording &&
      framesRef.current.length >= MAX_FRAMES &&
      !isFinished.current
    ) {
      isFinished.current = true;
      processGif();
      frameCounter.current = 0;
    }
  }, 1);

  const processGif = async () => {
    onFinished();

    if (Platform.OS !== "web") {
      Alert.alert("Processing", "Creating your 360° GIF...");
    }

    try {
      const expoContext = gl.getContext() as ExpoWebGLRenderingContext;
      const width = expoContext.drawingBufferWidth;
      const height = expoContext.drawingBufferHeight;

      const encoder = new GIFEncoder(width, height);
      encoder.setTransparent(0x000000);
      encoder.start();
      encoder.setRepeat(0);

      encoder.setDelay(60);

      for (const frame of framesRef.current) {
        encoder.addFrame(frame);
      }

      encoder.finish();
      const buffer = encoder.out.getData();

      if (Platform.OS === "web") {
        const blob = new Blob([new Uint8Array(buffer)], { type: "image/gif" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "rotation_viewer.gif";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const base64Gif = Buffer.from(buffer).toString("base64");
        // @ts-ignore
        const filename = `${FileSystem.cacheDirectory}viewer.gif`;
        await FileSystem.writeAsStringAsync(filename, base64Gif, {
          encoding: "base64",
        });

        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          await MediaLibrary.saveToLibraryAsync(filename);
          Alert.alert("Success", "GIF saved!");
        }
      }
    } catch (err) {
      console.error("GIF Error:", err);
      Alert.alert("Error", "Failed to process GIF.");
    } finally {
      framesRef.current = [];
      isFinished.current = false;
    }
  };

  return null;
};

function flipPixels(pixels: Uint8Array, width: number, height: number) {
  const flipped = new Uint8Array(pixels.length);
  const rowLength = width * 4;
  for (let y = 0; y < height; y++) {
    const targetY = height - 1 - y;
    flipped.set(
      pixels.subarray(y * rowLength, (y + 1) * rowLength),
      targetY * rowLength,
    );
  }
  return flipped;
}
