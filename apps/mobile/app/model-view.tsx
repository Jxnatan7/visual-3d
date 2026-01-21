import { Container } from "@/components/theme/Container";
import Model from "@/components/theme/Model";
import { ModelViewer } from "@/components/theme/MovelViewer";
import { useRouter } from "expo-router";

export default function ModelView() {
  const { push } = useRouter();
  return (
    <Container
      variant="screen"
      containerHeaderProps={{ backButtonFallback: () => push("/") }}
    >
      <ModelViewer>
        <Model />
      </ModelViewer>
    </Container>
  );
}
