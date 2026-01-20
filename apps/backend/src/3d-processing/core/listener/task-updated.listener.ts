import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MeshyTaskResponse } from "src/integration/core/interfaces/meshy-types";
import { TaskRepository } from "src/integration/core/repositories/task.repository";
import { Task } from "src/integration/core/schemas/task.schema";

@Injectable()
export class TaskUpdatedListener {
  private readonly logger = new Logger(TaskUpdatedListener.name);

  constructor(private readonly taskRepo: TaskRepository) {}

  @OnEvent("3d.task.updated")
  async handleTaskUpdate(payload: MeshyTaskResponse) {
    this.logger.log(
      `Recebendo atualização da Task: ${payload.id} - Status: ${payload.status}`,
    );

    const updateData: Partial<Task> = {
      status: payload.status,
      thumbnailUrl: payload.thumbnail_url,
      modelUrls: payload.model_urls
        ? {
            glb: payload.model_urls.glb,
            fbx: payload.model_urls.fbx,
            obj: payload.model_urls.obj,
            usdz: payload.model_urls.usdz,
          }
        : undefined,
      rawMetadata: payload,
    };

    try {
      await this.taskRepo.updateByExternalId(payload.id, updateData);
      this.logger.debug(
        `Task ${payload.id} atualizada com sucesso no banco de dados.`,
      );
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar Task ${payload.id} no banco: ${error.message}`,
      );
    }
  }
}
