import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { TaskUpdatedListener } from "src/3d-processing/core/listener/task-updated.listener";
import { GeneratorService } from "./core/services/3d-generator.service";
import { GeneratorController } from "./http/rest/controller/3d-generator.controller";
import { IntegrationModule } from "src/integration/integration.module";

@Module({
  imports: [HttpModule, IntegrationModule],
  providers: [TaskUpdatedListener, GeneratorService],
  exports: [TaskUpdatedListener],
  controllers: [GeneratorController],
})
export class Processing3dModule {}
