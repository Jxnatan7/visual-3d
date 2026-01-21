import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber/native";
import { ExpoWebGLRenderingContext } from "expo-gl";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Alert, InteractionManager, Platform } from "react-native";
// @ts-ignore
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import {
  WebGLRenderTarget,
  RGBAFormat,
  UnsignedByteType,
  LinearFilter,
  PerspectiveCamera,
} from "three";

global.Buffer = global.Buffer || Buffer;

const GIF_WIDTH = 2000;
const GIF_HEIGHT = 2000;
const MAX_FRAMES = 30;
const FRAME_SKIP = 4;
const VIEW_ROTATION_SPEED = 0.005;
const GIF_ADDITIONAL_ROTATION = 0.1;

export const GifRecorder = ({
  recording,
  onFinished,
}: {
  recording: boolean;
  onFinished: () => void;
}) => {
  const framesRef = useRef<Uint8Array[]>([]);
  const isFinished = useRef(false);
  const frameCounter = useRef(0);
  const gifRotationOffset = useRef(0);

  const renderTarget = useRef<WebGLRenderTarget | null>(null);

  useEffect(() => {
    renderTarget.current = new WebGLRenderTarget(GIF_WIDTH, GIF_HEIGHT, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: UnsignedByteType,
      stencilBuffer: false,
      depthBuffer: true,
    });

    return () => {
      renderTarget.current?.dispose();
    };
  }, []);

  useFrame((state) => {
    const { gl, scene, camera } = state;

    scene.rotation.y += VIEW_ROTATION_SPEED;

    gl.setRenderTarget(null);
    gl.render(scene, camera);

    if (recording && !isFinished.current && renderTarget.current) {
      if (framesRef.current.length < MAX_FRAMES) {
        frameCounter.current++;

        if (frameCounter.current % FRAME_SKIP === 0) {
          const rt = renderTarget.current;

          let originalAspect = 0;
          const isPerspective = (camera as any).isPerspectiveCamera;

          if (isPerspective) {
            const pCamera = camera as PerspectiveCamera;
            originalAspect = pCamera.aspect;
            pCamera.aspect = GIF_WIDTH / GIF_HEIGHT;
            pCamera.zoom = 2;
            pCamera.updateProjectionMatrix();
          }

          const originalRotation = scene.rotation.y;
          const direction = Math.sign(VIEW_ROTATION_SPEED);
          gifRotationOffset.current += GIF_ADDITIONAL_ROTATION * direction;
          scene.rotation.y += gifRotationOffset.current;

          gl.setClearColor(0x000000, 0);
          gl.setRenderTarget(rt);
          gl.clear();
          gl.render(scene, camera);

          scene.rotation.y = originalRotation;

          const expoContext = gl.getContext() as ExpoWebGLRenderingContext;
          const pixels = new Uint8Array(GIF_WIDTH * GIF_HEIGHT * 4);

          expoContext.readPixels(
            0,
            0,
            GIF_WIDTH,
            GIF_HEIGHT,
            expoContext.RGBA,
            expoContext.UNSIGNED_BYTE,
            pixels,
          );

          gl.setRenderTarget(null);

          if (isPerspective) {
            const pCamera = camera as PerspectiveCamera;
            pCamera.aspect = originalAspect;
            pCamera.zoom = 1;
            pCamera.updateProjectionMatrix();
          }

          const flippedPixels = flipPixels(pixels, GIF_WIDTH, GIF_HEIGHT);
          framesRef.current.push(flippedPixels);
        }
      } else {
        isFinished.current = true;
        processGif();
        frameCounter.current = 0;
        gifRotationOffset.current = 0;
      }
    } else if (!recording) {
      gifRotationOffset.current = 0;
    }
  }, 1);

  const processGif = async () => {
    await InteractionManager.runAfterInteractions(async () => {
      onFinished();

      try {
        const gif = GIFEncoder();

        for (let i = 0; i < framesRef.current.length; i++) {
          const frame = framesRef.current[i];
          const palette = quantize(frame, 256, { format: "rgba8888" });
          const index = applyPalette(frame, palette, { format: "rgba8888" });

          gif.writeFrame(index, GIF_WIDTH, GIF_HEIGHT, {
            palette,
            delay: 100,
            transparent: true,
            transparentIndex: 0,
          });

          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        gif.finish();
        const output = gif.bytes();

        if (Platform.OS === "web") {
          const blob = new Blob([output], { type: "image/gif" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `model-${Date.now()}.gif`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          const base64Gif = Buffer.from(output).toString("base64");
          const filename = `${FileSystem.cacheDirectory}model-${Date.now()}.gif`;

          await FileSystem.writeAsStringAsync(filename, base64Gif, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const permission = await MediaLibrary.requestPermissionsAsync();

          if (permission.granted) {
            try {
              await MediaLibrary.createAssetAsync(filename);
              Alert.alert("Sucesso", "GIF salvo na galeria!");

              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(filename, {
                  mimeType: "image/gif",
                  dialogTitle: "Compartilhar Modelo",
                  UTI: "com.compuserve.gif",
                });
              }
            } catch (e) {
              console.error(e);
              Alert.alert("Erro", "Falha ao salvar na galeria.");
            }
          }
        }
      } catch (err) {
        console.error("Erro na geração do GIF:", err);
        Alert.alert("Erro", "Falha ao gerar o GIF.");
      } finally {
        framesRef.current = [];
        isFinished.current = false;
      }
    });
  };

  // const processGif = async () => {
  //   await InteractionManager.runAfterInteractions(async () => {
  //     onFinished();

  //     try {
  //       const gif = GIFEncoder();

  //       for (let i = 0; i < framesRef.current.length; i++) {
  //         const frame = framesRef.current[i];

  //         // --- CORREÇÃO 1: Pré-processamento (Thresholding) ---
  //         // GIFs não suportam semi-transparência.
  //         // Forçamos pixels a serem totalmente opacos ou totalmente transparentes.
  //         for (let j = 0; j < frame.length; j += 4) {
  //           const alpha = frame[j + 3];

  //           // Se o pixel for menos que 50% visível, consideramos fundo transparente
  //           if (alpha < 128) {
  //             frame[j] = 0; // R
  //             frame[j + 1] = 0; // G
  //             frame[j + 2] = 0; // B
  //             frame[j + 3] = 0; // A
  //           } else {
  //             // Se for visível, forçamos opacidade total para proteger a cor do objeto
  //             frame[j + 3] = 255;
  //           }
  //         }

  //         // Gera a paleta baseada nos pixels já corrigidos
  //         const palette = quantize(frame, 256, { format: "rgba8888" });

  //         // --- CORREÇÃO 2: Encontrar o índice real da transparência ---
  //         // Não assumimos que é 0. Procuramos a cor [0,0,0,0] na paleta.
  //         let transparentIndex = -1;

  //         // A paleta retorna arrays de cores [r, g, b, a] ou números empacotados dependendo da versão.
  //         // O gifenc geralmente retorna array de arrays para rgba8888.
  //         for (let p = 0; p < palette.length; p++) {
  //           const color = palette[p];
  //           // Se o Alpha da cor na paleta for 0, achamos o índice transparente
  //           if (color[3] === 0) {
  //             transparentIndex = p;
  //             break;
  //           }
  //         }

  //         const index = applyPalette(frame, palette, { format: "rgba8888" });

  //         gif.writeFrame(index, GIF_WIDTH, GIF_HEIGHT, {
  //           palette,
  //           delay: 100, // Ajuste o delay conforme necessário (100ms = 10fps)
  //           transparent: transparentIndex !== -1,
  //           transparentIndex: transparentIndex,
  //         });

  //         // Pequena pausa para não travar a UI durante o loop pesado
  //         await new Promise((resolve) => setTimeout(resolve, 0));
  //       }

  //       gif.finish();

  //       // ... RESTANTE DO CÓDIGO (Download/Save) ...
  //       const output = gif.bytes();

  //       if (Platform.OS === "web") {
  //         const blob = new Blob([output], { type: "image/gif" });
  //         const url = URL.createObjectURL(blob);
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.download = `model-${Date.now()}.gif`;
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //         URL.revokeObjectURL(url);
  //       } else {
  //         const base64Gif = Buffer.from(output).toString("base64");
  //         const filename = `${FileSystem.cacheDirectory}model-${Date.now()}.gif`;

  //         await FileSystem.writeAsStringAsync(filename, base64Gif, {
  //           encoding: FileSystem.EncodingType.Base64,
  //         });

  //         const permission = await MediaLibrary.requestPermissionsAsync();

  //         if (permission.granted) {
  //           try {
  //             await MediaLibrary.createAssetAsync(filename);
  //             Alert.alert("Sucesso", "GIF salvo na galeria!");

  //             if (await Sharing.isAvailableAsync()) {
  //               await Sharing.shareAsync(filename, {
  //                 mimeType: "image/gif",
  //                 dialogTitle: "Compartilhar Modelo",
  //                 UTI: "com.compuserve.gif",
  //               });
  //             }
  //           } catch (e) {
  //             console.error(e);
  //             Alert.alert("Erro", "Falha ao salvar na galeria.");
  //           }
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Erro na geração do GIF:", err);
  //       Alert.alert("Erro", "Falha ao gerar o GIF.");
  //     } finally {
  //       framesRef.current = [];
  //       isFinished.current = false;
  //     }
  //   });
  // };

  return null;
};

function flipPixels(pixels: Uint8Array, width: number, height: number) {
  const halfHeight = Math.floor(height / 2);
  const rowBytes = width * 4;
  const tempRow = new Uint8Array(rowBytes);

  for (let y = 0; y < halfHeight; y++) {
    const topOffset = y * rowBytes;
    const bottomOffset = (height - 1 - y) * rowBytes;
    tempRow.set(pixels.subarray(topOffset, topOffset + rowBytes));
    pixels.copyWithin(topOffset, bottomOffset, bottomOffset + rowBytes);
    pixels.set(tempRow, bottomOffset);
  }
  return pixels;
}
