import Model from "@/components/theme/Model";
import { ModelViewer } from "@/components/theme/MovelViewer";
import { View } from "react-native";

export default function Example() {
  return (
    <View style={{ flex: 1 }}>
      <ModelViewer>
        <Model />
      </ModelViewer>
    </View>
  );
}
