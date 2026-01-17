import { localModels } from "@/assets";
import { useGLTF } from "@react-three/drei/native";

export const Model = (props: any) => {
  const obj = useGLTF(localModels[0]) as any;

  return <primitive object={obj.scene} scale={1} {...props} />;
};
