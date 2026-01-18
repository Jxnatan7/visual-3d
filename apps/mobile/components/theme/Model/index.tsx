import { localModels } from "@/assets";
import { useGLTF } from "@react-three/drei/native";
import { Asset } from "expo-asset";

const modelId = localModels[0];
const modelUri = Asset.fromModule(modelId).uri;

export default function Model({ url, ...props }: { url?: string } & any) {
  const { scene } = useGLTF(url || modelUri) as any;

  return <primitive object={scene} {...props} />;
}
