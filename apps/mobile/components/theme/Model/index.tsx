import { localModels } from "@/assets";
import { useGLTF } from "@react-three/drei/native";
import { Asset } from "expo-asset";
import { useMemo } from "react";

const modelId = localModels[0];
const modelUri = Asset.fromModule(modelId).uri;
export default function Model({ url, ...props }: { url?: string } & any) {
  const { scene } = useMemo(() => useGLTF(url || modelUri) as any, [url]);

  scene.traverse((obj: any) => {
    if (obj.isMesh) {
      obj.castShadow = false;
      obj.receiveShadow = false;
    }
  });

  return <primitive object={scene} {...props} />;
}
