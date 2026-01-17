import { localModels } from "@/assets";
import { useGLTF } from "@react-three/drei/native";
import { Platform } from "react-native";

export const Model = (props: any) => {
  const obj = useGLTF(localModels[0]) as any;

  return <primitive object={obj.scene} scale={1} {...props} />;
};

export function ModelCompressed(props: any) {
  const { nodes, materials } = useGLTF(localModels[1]) as any;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.mesh_0.geometry} material={nodes.mesh_0.material} />
    </group>
  );
}

export default Platform.OS === "web" ? ModelCompressed : Model;
