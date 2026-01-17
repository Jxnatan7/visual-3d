import React from "react";
import { useGLTF } from "@react-three/drei";
import { localModels } from "@/assets";

export function ModelCompressed(props: any) {
  const { nodes, materials } = useGLTF(localModels[0]) as any;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.mesh_0.geometry} material={nodes.mesh_0.material} />
    </group>
  );
}
