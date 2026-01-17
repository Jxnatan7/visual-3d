import { ModelCompressed } from "@/components/theme/ModelCompressed";
import { Scene } from "@/components/theme/Scene";
import { View } from "react-native";

export default function Example() {
  return (
    <View style={{ flex: 1 }}>
      <Scene>
        <ModelCompressed />
      </Scene>
    </View>
  );
}
