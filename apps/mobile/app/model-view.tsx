import { Box } from "@/components/restyle";
import Model from "@/components/theme/Model";
import { ModelViewer } from "@/components/theme/MovelViewer";

export default function ModelView() {
  return (
    <Box style={{ flex: 1 }}>
      <ModelViewer>
        <Model />
      </ModelViewer>
    </Box>
  );
}
