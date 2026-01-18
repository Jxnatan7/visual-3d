import {
  FilamentScene,
  FilamentView,
  DefaultLight,
  Model,
  Camera,
} from "react-native-filament";

export function ModelViewerScreen({ source }: { source: any }) {
  return (
    <FilamentScene>
      <FilamentView style={{ flex: 1 }}>
        <DefaultLight />

        <Model source={source} />

        <Camera />
      </FilamentView>
    </FilamentScene>
  );
}
