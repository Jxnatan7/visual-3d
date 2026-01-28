import { localModels } from "@/assets";
import { useGLTF } from "@react-three/drei/native";
import { Asset } from "expo-asset";
import { useEffect } from "react";

const modelId = localModels[0];
const modelUri = Asset.fromModule(modelId).uri;

export default function Model({ url }: { url?: string }) {
  const { scene } = useGLTF(url || modelUri) as any;

  useEffect(() => {
    if (url) {
      Asset.fromModule(url).downloadAsync();
      useGLTF.preload(url);
    }
  }, [url]);

  return <primitive object={scene} />;
}

useGLTF.preload(modelUri);
