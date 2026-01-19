import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber/native";
import { ExpoWebGLRenderingContext } from "expo-gl";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Alert, Platform } from "react-native";
// @ts-ignore
import { GIFEncoder, quantize, applyPalette } from "gifenc";

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

  const framesRef = useRef<Uint8Array[]>([]);
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
      framesRef.current.push(flippedPixels);
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

    try {
      const expoContext = gl.getContext() as ExpoWebGLRenderingContext;
      const width = expoContext.drawingBufferWidth;
      const height = expoContext.drawingBufferHeight;

      const gif = GIFEncoder();

      for (const frame of framesRef.current) {
        const palette = quantize(frame, 256);
        const index = applyPalette(frame, palette);
        gif.writeFrame(index, width, height, {
          palette,
          delay: 60,
          transparent: true,
          transparentIndex: 0,
        });
      }

      gif.finish();
      const output = gif.bytes();

      if (Platform.OS === "web") {
        const blob = new Blob([output], { type: "image/gif" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "rotation_viewer.gif";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const base64Gif = Buffer.from(output).toString("base64");
        // @ts-ignore
        const cacheFilename = `${FileSystem.cacheDirectory}3d-capture-${Date.now()}.gif`;

        await FileSystem.writeAsStringAsync(cacheFilename, base64Gif, {
          // @ts-ignore
          encoding: "base64",
        });

        const permission = await MediaLibrary.requestPermissionsAsync();

        if (permission.granted) {
          try {
            const asset = await MediaLibrary.createAssetAsync(cacheFilename);

            Alert.alert("Sucesso", "GIF salvo na sua galeria!");
            const isSharingAvailable = await Sharing.isAvailableAsync();

            if (isSharingAvailable) {
              await Sharing.shareAsync(cacheFilename, {
                mimeType: "image/gif",
                dialogTitle: "Compartilhar seu Modelo 3D",
                UTI: "com.compuserve.gif",
              });
            }
          } catch (e) {
            console.error("Erro ao salvar na galeria:", e);
            Alert.alert("Erro", "Não foi possível salvar na galeria.");
          }
        } else {
          Alert.alert(
            "Permissão negada",
            "Precisamos de acesso à galeria para salvar o GIF.",
          );
        }
      }
    } catch (err) {
      console.error("GIF Error:", err);
      Alert.alert("Error", "Failed to process and share GIF.");
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
