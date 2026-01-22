import { localModels } from "@/assets";
import { useGLTF } from "@react-three/drei/native";
import { Asset } from "expo-asset";

const modelId = localModels[0];
const modelUri = Asset.fromModule(modelId).uri;

export default function Model({ url }: { url?: string }) {
  const { scene } = useGLTF(url || modelUri) as any;

  return <primitive object={scene} />;
}

useGLTF.preload(modelUri);

export const preloadModel = (url: string) => {
  return useGLTF.preload(url);
};
