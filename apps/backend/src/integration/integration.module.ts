import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MeshyAIProvider } from "./core/providers/meshy-ai.provider";

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: "AI_SERVICE",
      useClass: MeshyAIProvider,
    },
  ],
  exports: ["AI_SERVICE"],
})
export class IntegrationModule {}
