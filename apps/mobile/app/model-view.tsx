import { Container } from "@/components/theme/Container";
import Model from "@/components/theme/Model";
import { ModelViewer } from "@/components/theme/MovelViewer";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ModelView() {
  const { push } = useRouter();
  const { glb } = useLocalSearchParams<{
    id: string;
    glb: string;
  }>();

  return (
    <Container
      variant="screen"
      containerHeaderProps={{ backButtonFallback: () => push("/") }}
    >
      <ModelViewer>
        <Model url={glb} />
      </ModelViewer>
    </Container>
  );
}
