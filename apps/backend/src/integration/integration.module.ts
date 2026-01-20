import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MeshyAIProvider } from "./core/providers/meshy-ai.provider";
import { Task, TaskSchema } from "./core/schemas/task.schema";
import { TaskRepository } from "./core/repositories/task.repository";
import { TaskUpdatedListener } from "src/3d-processing/core/listener/task-updated.listener";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    HttpModule,
  ],
  providers: [
    TaskRepository,
    TaskUpdatedListener,
    MeshyAIProvider,
    {
      provide: "AI_PROVIDER",
      useClass: MeshyAIProvider,
    },
  ],
  exports: [TaskRepository, "AI_PROVIDER"],
})
export class IntegrationModule {}
